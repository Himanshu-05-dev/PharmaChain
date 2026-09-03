import { existsSync, readFileSync } from 'fs';
import { createReadStream } from 'fs';
import { getLocalExportPath, isS3Configured } from '../services/s3.service.js';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parses a CSV string (with header row) into an array of plain objects.
 * Handles quoted fields containing commas correctly.
 * @param {string} csvText - Full CSV file content.
 * @returns {Array<Object>}
 */
export const parseCsv = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // First line is the header
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

    return lines.slice(1).map((line) => {
        // Regex-based split to handle quoted CSV fields properly
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                inQuotes = !inQuotes;
            } else if (ch === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
        values.push(current); // push last field

        const obj = {};
        headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });
        return obj;
    });
};

/**
 * Reads the raw CSV text for a batch.
 * - Local mode: reads from ./data/exports/{batchId}.csv
 * - S3 mode:   fetches from S3 using the provided s3FileKey
 *
 * @param {string} batchId
 * @param {string|null} s3FileKey  - S3 object key (null in local mode)
 * @returns {Promise<string>}       Raw CSV text
 */
export const readCsvContent = async (batchId, s3FileKey) => {
    // 1. Try S3 if configured
    if (isS3Configured()) {
        const key = (s3FileKey && !s3FileKey.startsWith('local:')) ? s3FileKey : `batches/${batchId}.csv`;
        try {
            const s3 = new S3Client({
                region:      process.env.AWS_REGION || 'us-east-1',
                credentials: {
                    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });

            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key:    key,
            });

            const response = await s3.send(command);

            const chunks = [];
            for await (const chunk of response.Body) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks).toString('utf-8');
        } catch (s3Err) {
            console.warn(`[pharma-core S3] S3 fetch attempt for key [${key}] notice: ${s3Err.message}`);
        }
    }

    // 2. Read from local disk (dev fallback)
    const filePath = getLocalExportPath(batchId);
    if (existsSync(filePath)) {
        return readFileSync(filePath, 'utf-8');
    }

    throw new Error(`CSV file not found for batch: ${batchId}`);
};

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * GET /core/export/:batchId
 *
 * Local-fallback CSV download endpoint.
 * Active ONLY when AWS credentials are not configured (dev / offline mode).
 *
 * In production (AWS configured):
 *   - This route is never called; factory printers download directly from the S3 pre-signed URL.
 *
 * In development (no AWS creds):
 *   - Serves the CSV file generated during minting directly from disk.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
export const localExportDownloadController = async (req, res) => {
    const { batchId } = req.params;

    if (!batchId || !/^[\w\-]+$/.test(batchId)) {
        return res.status(400).json({ code: 'INVALID_BATCH_ID', message: 'batchId is invalid or malformed' });
    }

    // 1. Check AWS S3 first if configured
    if (isS3Configured()) {
        const s3Key = req.query.s3FileKey || `batches/${batchId}.csv`;
        try {
            const s3Client = new S3Client({
                region: process.env.AWS_REGION || 'us-east-1',
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });

            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: s3Key,
            });

            const s3Response = await s3Client.send(command);

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${batchId}.csv"`);
            res.setHeader('X-Export-Mode', 's3');

            return s3Response.Body.pipe(res);
        } catch (s3Err) {
            console.warn(`[pharma-core Export] S3 stream attempt failed for ${batchId}:`, s3Err.message);
        }
    }

    // 2. Check local disk fallback
    const filePath = getLocalExportPath(batchId);

    if (existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${batchId}.csv"`);
        res.setHeader('X-Export-Mode', 'local-fallback');

        const fileStream = createReadStream(filePath);

        fileStream.on('error', (err) => {
            console.error(`[pharma-core Export] Stream error for ${batchId}:`, err.message);
            if (!res.headersSent) {
                res.status(500).json({ code: 'STREAM_ERROR', message: err.message });
            }
        });

        return fileStream.pipe(res);
    }

    return res.status(404).json({
        code: 'FILE_NOT_FOUND',
        message: `CSV file not found for batch ${batchId}. The batch artifact may not have been minted yet or was purged.`,
    });
};

export const exportBatchCsvController = localExportDownloadController;

/**
 * GET /core/export/:batchId/preview
 *
 * Internal API that reads the batch CSV (from local disk or S3) and returns
 * paginated, searchable JSON data for the manufacturer dashboard UI preview page.
 *
 * This endpoint is called by manufacturer-service — NOT by the browser directly.
 * manufacturer-service's /api/manufacturer/batch/:batchId/preview proxies this.
 *
 * Query Parameters:
 *   - page:   number  (default: 1)
 *   - limit:  number  (default: 50, max: 200)
 *   - search: string  (optional — filters by serialNumber or packHash prefix)
 *
 * Query body (POST body):
 *   - s3FileKey: string (optional — required for S3 mode to fetch the right object)
 */
export const exportPreviewController = async (req, res) => {
    try {
        const { batchId }  = req.params;
        const s3FileKey    = req.query.s3FileKey || req.body?.s3FileKey || null;
        const search       = (req.query.search || '').trim().toLowerCase();
        const page         = Math.max(1, parseInt(req.query.page  || '1',  10));
        const limit        = Math.min(200, Math.max(1, parseInt(req.query.limit || '50', 10)));

        if (!batchId || !/^[\w\-]+$/.test(batchId)) {
            return res.status(400).json({
                code:    'INVALID_BATCH_ID',
                message: 'batchId is invalid or contains disallowed characters',
            });
        }

        // ── Read & parse the CSV ──────────────────────────────────────────────
        let csvText;
        try {
            csvText = await readCsvContent(batchId, s3FileKey);
        } catch (readErr) {
            console.warn(`[pharma-core Export] CSV artifact not found for ${batchId}: ${readErr.message}. Returning empty preview.`);
            return res.status(200).json({
                status:  'success',
                batchId,
                s3Mode:  'local',
                stats: {
                    totalPacks:    0,
                    filteredPacks: 0,
                    csvSizeBytes:  0,
                },
                meta: {
                    page,
                    limit,
                    pages: 0,
                    total: 0,
                },
                packs: [],
                notice: 'CSV artifact is not cached locally or on S3 for this batch.',
            });
        }

        const allRows    = parseCsv(csvText);
        const csvSizeBytes = Buffer.byteLength(csvText, 'utf-8');

        // ── Apply search filter ───────────────────────────────────────────────
        const filtered = search
            ? allRows.filter(
                (r) =>
                    (r.serialNumber || '').toLowerCase().includes(search) ||
                    (r.packHash     || '').toLowerCase().startsWith(search) ||
                    (r.medicineName || '').toLowerCase().includes(search),
              )
            : allRows;

        // ── Paginate ──────────────────────────────────────────────────────────
        const total    = filtered.length;
        const pages    = Math.ceil(total / limit);
        const offset   = (page - 1) * limit;
        const pageRows = filtered.slice(offset, offset + limit);

        // ── Format rows for UI ────────────────────────────────────────────────
        const packs = pageRows.map((r) => ({
            serialNumber: r.serialNumber || '',
            packHash:     r.packHash     || '',
            signedToken:  r.signedToken  || '',
            verifyUrl:    r.verifyUrl    || '',
            medicineName: r.medicineName || '',
            expiryDate:   r.expiryDate   || '',
            // qrPreviewUrl is the URL to embed in a QR code image on the dashboard
            qrPreviewUrl: r.verifyUrl    || '',
        }));

        const s3Mode = (isS3Configured() && s3FileKey && !s3FileKey.startsWith('local:'))
            ? 'aws'
            : 'local';

        console.log(
            `[pharma-core Export] Preview: ${batchId} | ` +
            `${allRows.length} total packs | page ${page}/${pages} | search: "${search || 'none'}"`,
        );

        return res.status(200).json({
            status:  'success',
            batchId,
            s3Mode,
            stats: {
                totalPacks:    allRows.length,
                filteredPacks: filtered.length,
                csvSizeBytes,
            },
            meta: {
                page,
                limit,
                pages,
                total,
            },
            packs,
        });
    } catch (err) {
        console.error('[pharma-core Export] exportPreviewController error:', err.message);
        return res.status(500).json({ code: 'PREVIEW_ERROR', message: err.message });
    }
};
