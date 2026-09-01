import {
    fetchManufacturers,
    fetchManufacturerById,
    approveManufacturerKYC,
    rejectManufacturerKYC,
    blockManufacturerKYC,
    unblockManufacturerKYC,
} from '../services/manufacturerClient.service.js';
import { fetchPublicKey } from '../services/pharmaCoreClient.service.js';
import AuditLog from '../models/auditLog.model.js';

// GET /api/admin/manufacturers
export const listManufacturersController = async (req, res) => {
    try {
        console.log(`[admin-service Manufacturer] listManufacturers requested by admin: ${req.admin?.email} (${req.admin?.role}) with query:`, req.query);
        const result = await fetchManufacturers(req.query);
        console.log(`[admin-service Manufacturer] listManufacturers successfully retrieved ${(result.data || []).length} records`);
        return res.status(200).json(result);
    } catch (error) {
        console.error('[admin-service Manufacturer] listManufacturers error:', error.message, error.response?.data || '');
        const status = error.response?.status || 500;
        return res.status(status).json({ status: 'error', message: error.response?.data?.message || error.message });
    }
};

// GET /api/admin/manufacturers/:id
export const getManufacturerDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[admin-service Manufacturer] getManufacturerDetail requested for identifier: ${id} by admin: ${req.admin?.email}`);
        const result = await fetchManufacturerById(id);
        const mfr = result.data;

        // Augment with pharma-core key check if available
        let keyInfo = null;
        if (mfr && mfr.manufacturerId) {
            try {
                keyInfo = await fetchPublicKey(mfr.manufacturerId);
                console.log(`[admin-service Manufacturer] Fetched public key status for ${mfr.manufacturerId}`);
            } catch (kErr) {
                console.warn(`[admin-service Manufacturer] Public key check for ${mfr.manufacturerId} skipped: ${kErr.message}`);
            }
        }

        console.log(`[admin-service Manufacturer] getManufacturerDetail returning full profile for: ${mfr?.companyName || id}, submitted at: ${mfr?.createdAt}`);

        return res.status(200).json({
            status: 'success',
            data: {
                ...mfr,
                keyDetails: keyInfo,
            },
        });
    } catch (error) {
        console.error('[admin-service Manufacturer] getManufacturerDetail error:', error.message, error.response?.data || '');
        const status = error.response?.status || 500;
        return res.status(status).json({ status: 'error', message: error.response?.data?.message || error.message });
    }
};

// POST /api/admin/manufacturers/:id/approve
export const approveManufacturerController = async (req, res) => {
    try {
        const { id } = req.params;
        const reason = req.body?.reason || 'KYC documentation and drug manufacturing license verified against CDSCO registry.';
        console.log(`[admin-service Manufacturer] approveManufacturer called for ID: ${id} by admin: ${req.admin?.email} (${req.admin?.adminId}), reason: "${reason}"`);

        const result = await approveManufacturerKYC(id);
        console.log(`[admin-service Manufacturer] approveManufacturerKYC response:`, result);

        // Regulatory audit log
        await AuditLog.create({
            action:      'MANUFACTURER_APPROVED',
            performedBy: {
                adminId:  req.admin.adminId,
                email:    req.admin.email,
                fullName: req.admin.fullName,
                role:     req.admin.role,
            },
            targetType:  'MANUFACTURER',
            targetId:    result.manufacturerId || id,
            targetName:  result.companyName || null,
            reason,
            metadata: {
                keyGenerated: result.keyGenerated,
                verifiedAt:   result.verifiedAt,
                createdAt:    result.createdAt,
                licenseNumber:result.licenseNumber,
                email:        result.email,
            },
            ipAddress:   req.ip || 'internal',
        });

        console.log(`[admin-service Manufacturer] AuditLog entry recorded for approval of ${result.companyName || id}`);

        return res.status(200).json({
            status:  'success',
            message: 'Manufacturer approved. ECDSA P-256 signing key provisioned in keystore.',
            data:    result,
        });
    } catch (error) {
        console.error('[admin-service Manufacturer] approveManufacturer error:', error.message, error.response?.data || '');
        const status = error.response?.status || 500;
        return res.status(status).json({ status: 'error', message: error.response?.data?.message || error.message });
    }
};

// POST /api/admin/manufacturers/:id/reject
export const rejectManufacturerController = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        console.log(`[admin-service Manufacturer] rejectManufacturer called for ID: ${id} by admin: ${req.admin?.email}, reason: "${reason}"`);

        if (!reason || !reason.trim()) {
            return res.status(400).json({ status: 'error', message: 'Rejection reason is required for compliance audit logs' });
        }

        const result = await rejectManufacturerKYC(id, reason.trim());
        console.log(`[admin-service Manufacturer] rejectManufacturerKYC response:`, result);

        // Regulatory audit log
        await AuditLog.create({
            action:      'MANUFACTURER_REJECTED',
            performedBy: {
                adminId:  req.admin.adminId,
                email:    req.admin.email,
                fullName: req.admin.fullName,
                role:     req.admin.role,
            },
            targetType:  'MANUFACTURER',
            targetId:    result.manufacturerId || id,
            targetName:  result.companyName || null,
            reason:      reason.trim(),
            metadata: {
                licenseNumber: result.licenseNumber,
                email:         result.email,
                rejectedAt:    new Date(),
            },
            ipAddress:   req.ip || 'internal',
        });

        console.log(`[admin-service Manufacturer] AuditLog entry recorded for rejection of ${result.companyName || id}`);

        return res.status(200).json({
            status:  'success',
            message: 'Manufacturer registration rejected.',
            data:    result,
        });
    } catch (error) {
        console.error('[admin-service Manufacturer] rejectManufacturer error:', error.message, error.response?.data || '');
        const status = error.response?.status || 500;
        return res.status(status).json({ status: 'error', message: error.response?.data?.message || error.message });
    }
};

// POST /api/admin/manufacturers/:id/block
export const blockManufacturerController = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        console.log(`[admin-service Manufacturer] blockManufacturer called for ID: ${id} by admin: ${req.admin?.email}, reason: "${reason}"`);

        if (!reason || !reason.trim()) {
            return res.status(400).json({ status: 'error', message: 'Blocking/Suspension reason is required for regulatory audit trail' });
        }

        const result = await blockManufacturerKYC(id, reason.trim(), req.admin?.adminId);
        console.log(`[admin-service Manufacturer] blockManufacturerKYC response:`, result);

        // Regulatory audit log
        await AuditLog.create({
            action:      'MANUFACTURER_BLOCKED',
            performedBy: {
                adminId:  req.admin.adminId,
                email:    req.admin.email,
                fullName: req.admin.fullName,
                role:     req.admin.role,
            },
            targetType:  'MANUFACTURER',
            targetId:    result.manufacturerId || id,
            targetName:  result.companyName || null,
            reason:      reason.trim(),
            metadata: {
                licenseNumber: result.licenseNumber,
                email:         result.email,
                blockedAt:     new Date(),
                action:        'EMERGENCY_ACCOUNT_FREEZE',
            },
            ipAddress:   req.ip || 'internal',
        });

        console.log(`[admin-service Manufacturer] AuditLog entry recorded for BLOCK of ${result.companyName || id}`);

        return res.status(200).json({
            status:  'success',
            message: `Manufacturer ${result.companyName || id} has been BLOCKED.`,
            data:    result,
        });
    } catch (error) {
        console.error('[admin-service Manufacturer] blockManufacturer error:', error.message, error.response?.data || '');
        const status = error.response?.status || 500;
        return res.status(status).json({ status: 'error', message: error.response?.data?.message || error.message });
    }
};

// POST /api/admin/manufacturers/:id/unblock
export const unblockManufacturerController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[admin-service Manufacturer] unblockManufacturer called for ID: ${id} by admin: ${req.admin?.email}`);

        const result = await unblockManufacturerKYC(id, req.admin?.adminId);
        console.log(`[admin-service Manufacturer] unblockManufacturerKYC response:`, result);

        // Regulatory audit log
        await AuditLog.create({
            action:      'MANUFACTURER_UNBLOCKED',
            performedBy: {
                adminId:  req.admin.adminId,
                email:    req.admin.email,
                fullName: req.admin.fullName,
                role:     req.admin.role,
            },
            targetType:  'MANUFACTURER',
            targetId:    result.manufacturerId || id,
            targetName:  result.companyName || null,
            reason:      req.body.reason || 'Account suspension lifted by regulatory authority.',
            metadata: {
                licenseNumber: result.licenseNumber,
                email:         result.email,
                unblockedAt:   new Date(),
            },
            ipAddress:   req.ip || 'internal',
        });

        console.log(`[admin-service Manufacturer] AuditLog entry recorded for UNBLOCK of ${result.companyName || id}`);

        return res.status(200).json({
            status:  'success',
            message: `Manufacturer ${result.companyName || id} has been UNBLOCKED and access restored.`,
            data:    result,
        });
    } catch (error) {
        console.error('[admin-service Manufacturer] unblockManufacturer error:', error.message, error.response?.data || '');
        const status = error.response?.status || 500;
        return res.status(status).json({ status: 'error', message: error.response?.data?.message || error.message });
    }
};
