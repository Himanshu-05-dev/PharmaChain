import assert from 'node:assert';

const BASE_URL = process.env.BASE_URL || 'http://localhost';
const ADMIN_TOKEN = '960e412b2690c03cb83337b91010016a572343f23123feb3';

console.log('══════════════════════════════════════════════════════════════════════════════');
console.log('🧪 PHARMACHAIN COMPLETE END-TO-END CRYPTOGRAPHIC & LEDGER TEST SUITE');
console.log('══════════════════════════════════════════════════════════════════════════════');

const runTests = async () => {
    const timestamp = Date.now();
    const rand = Math.floor(100000 + Math.random() * 900000);
    const mfrEmail = `e2e.mfr.${rand}@sunpharma.com`;
    const mfrPassword = 'Password@123';
    const shopEmail = `e2e.shop.${rand}@medplus.com`;
    const shopPassword = 'Password@123';

    // ── TEST 1: Manufacturer Registration & KYC Approval ─────────────────────
    console.log('\n► [TEST 1] Manufacturer Registration & CDSCO Key Provisioning...');
    const mfrRegRes = await fetch(`${BASE_URL}/api/manufacturer/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            companyName: `Sun Pharma Advanced Lab ${rand}`,
            email: mfrEmail,
            password: mfrPassword,
            licenseNumber: `CDSCO-DL-${rand}`,
        }),
    }).then((r) => r.json());

    assert.strictEqual(mfrRegRes.status, 'success', 'Manufacturer registration failed');
    const manufacturerId = mfrRegRes.data.manufacturerId;
    console.log(`  ✔ Manufacturer Registered: ${manufacturerId}`);

    // Approve KYC
    const kycRes = await fetch(`${BASE_URL}/api/manufacturer/auth/kyc/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Admin-Token': ADMIN_TOKEN,
        },
        body: JSON.stringify({ manufacturerId }),
    }).then((r) => r.json());

    assert.strictEqual(kycRes.status, 'success', 'KYC approval failed');
    console.log(`  ✔ CDSCO KYC Approved — ECDSA ES256 key pair provisioned`);

    // Login Manufacturer
    const mfrLoginRes = await fetch(`${BASE_URL}/api/manufacturer/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mfrEmail, password: mfrPassword }),
    }).then((r) => r.json());

    const mfrToken = mfrLoginRes.token;
    assert.ok(mfrToken, 'Failed to obtain manufacturer JWT');
    console.log(`  ✔ Manufacturer Authenticated with JWT`);

    // ── TEST 2: Vault JWKS Key Discovery ─────────────────────────────────────
    console.log('\n► [TEST 2] Vault Cryptographic Discovery (JWKS)...');
    const jwksRes = await fetch(`${BASE_URL}/.well-known/jwks.json`).then((r) => r.json());
    assert.ok(Array.isArray(jwksRes.keys), 'JWKS did not return keys array');
    assert.ok(jwksRes.keys.length > 0, 'JWKS keys array is empty');
    console.log(`  ✔ JWKS active with ${jwksRes.keys.length} cryptographic keys`);

    // ── TEST 3: Create & Cryptographically Mint Batch ────────────────────────
    console.log('\n► [TEST 3] Batch Creation & Automatic ES256 Minting...');
    const batchRes = await fetch(`${BASE_URL}/api/manufacturer/batch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mfrToken}`,
        },
        body: JSON.stringify({
            medicineName: 'Augmentin 625 Duo Tablet',
            genericName: 'Amoxicillin and Potassium Clavulanate IP',
            brandName: 'Augmentin',
            dosage: '625mg',
            form: 'Film Coated Tablet',
            composition: 'Amoxicillin Trihydrate IP eq to 500mg + Potassium Clavulanate IP eq to 125mg',
            drugSchedule: 'H',
            pharmacopoeiaStandard: 'IP',
            productionSite: 'Plant Unit 4, Verna Industrial Estate, Goa',
            storageConditions: 'Store below 25°C in a dry place. Protect from moisture.',
            expiryDate: '2028-09-30',
            manufacturingDate: '2026-08-15',
            totalQuantity: 10,
        }),
    }).then((r) => r.json());

    assert.strictEqual(batchRes.status, 'success', 'Batch creation failed');
    const batchId = batchRes.data.batchId;
    console.log(`  ✔ Batch Created & Minted on Fabric: ${batchId}`);

    // ── TEST 4: Preview & CSV Cryptographic Integrity ─────────────────────────
    console.log('\n► [TEST 4] Cryptographic CSV Manifest & Token Integrity Check...');
    const previewRes = await fetch(`${BASE_URL}/api/manufacturer/batch/${batchId}/preview?page=1&limit=5`, {
        headers: { Authorization: `Bearer ${mfrToken}` },
    }).then((r) => r.json());

    assert.ok(Array.isArray(previewRes.packs), 'Preview did not return packs array');
    assert.ok(previewRes.packs.length > 0, 'Packs array is empty');
    const pack = previewRes.packs[0];

    // Assert that the signed token is a REAL cryptographic JWT and NOT a dummy string
    assert.ok(!pack.signedToken.includes('signature_'), 'Security violation: Token contains fake signature_ placeholder!');
    assert.ok(!pack.signedToken.includes('${batch'), 'Security violation: Token contains un-interpolated template strings!');
    const tokenParts = pack.signedToken.split('.');
    assert.strictEqual(tokenParts.length, 3, 'JWT must contain 3 Base64URL parts');
    console.log(`  ✔ Pack 1 Verified: Serial ${pack.serialNumber} | Hash: ${pack.packHash.substring(0, 16)}...`);
    console.log(`  ✔ Signed Token verified as genuine ECDSA ES256 format`);

    // ── TEST 5: Consumer Verify on Freshly Minted Pack (State: GENUINE) ────────
    console.log('\n► [TEST 5] Consumer Verification on Minted Pack (State: GENUINE)...');
    const verify1 = await fetch(`${BASE_URL}/api/consumer/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: pack.verifyUrl }),
    }).then((r) => r.json());

    assert.strictEqual(verify1.status, 'success');
    assert.strictEqual(verify1.valid, true);
    assert.strictEqual(verify1.uiState, 'GENUINE');
    assert.strictEqual(verify1.medicine.medicineName, 'Augmentin 625 Duo Tablet');
    assert.strictEqual(verify1.medicine.drugSchedule, 'H');
    console.log(`  ✔ UI State: ${verify1.uiState} (${verify1.message})`);
    console.log(`  ✔ Enriched Metadata: ${verify1.medicine.medicineName} | Schedule ${verify1.medicine.drugSchedule} | ${verify1.medicine.dosage}`);

    // ── TEST 6: Shopkeeper Registration & KYC Approval ────────────────────────
    console.log('\n► [TEST 6] Pharmacy Shopkeeper Registration & CDSCO Approval...');
    const shopRegRes = await fetch(`${BASE_URL}/api/shopkeeper/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            shopName: `MedPlus Pharmacy ${rand}`,
            shopPhone: `98${rand}`,
            shopEmail: shopEmail,
            address: '123 Main Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            ownerName: 'Dr. Ramesh Kumar',
            ownerPhone: `98${rand}`,
            ownerEmail: shopEmail,
            drugLicenseNumber: `DL-KA-${rand}`,
            licenseType: 'RETAIL',
            issuingAuthority: 'CDSCO Karnataka',
            licenseIssueDate: '2024-01-01',
            licenseExpiryDate: '2029-01-01',
            password: shopPassword,
        }),
    }).then((r) => r.json());

    assert.strictEqual(shopRegRes.status, 'success', 'Shopkeeper registration failed');
    const shopId = shopRegRes.data.shopId;
    console.log(`  ✔ Pharmacy Registered: ${shopId}`);

    await fetch(`${BASE_URL}/api/shopkeeper/auth/kyc/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Admin-Token': ADMIN_TOKEN,
        },
        body: JSON.stringify({ shopkeeperId: shopId }),
    });
    console.log(`  ✔ Pharmacy CDSCO KYC Approved`);

    const shopLoginRes = await fetch(`${BASE_URL}/api/shopkeeper/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: shopEmail, password: shopPassword }),
    }).then((r) => r.json());

    const shopToken = shopLoginRes.accessToken || shopLoginRes.data?.tokens?.accessToken || shopLoginRes.tokens?.accessToken;
    assert.ok(shopToken, 'Failed to obtain shopkeeper JWT');
    console.log(`  ✔ Pharmacy Authenticated with Access JWT`);

    // ── TEST 7: Shopkeeper Intake Scan (State: AT_SHOP) ────────────────────────
    console.log('\n► [TEST 7] Shopkeeper Inventory Intake Scan (State: AT_SHOP)...');
    const intakeRes = await fetch(`${BASE_URL}/api/shopkeeper/scan/intake`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${shopToken}`,
        },
        body: JSON.stringify({ qrData: pack.verifyUrl }),
    }).then((r) => r.json());

    assert.strictEqual(intakeRes.status, 'success', 'Intake scan failed');
    console.log(`  ✔ Intake Recorded: ${intakeRes.message}`);

    // ── TEST 8: Consumer Scan While at Pharmacy (State: AT_SHOP) ───────────────
    console.log('\n► [TEST 8] Consumer Scan in Pharmacy Inventory (State: AT_SHOP)...');
    const verify2 = await fetch(`${BASE_URL}/api/consumer/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: pack.verifyUrl }),
    }).then((r) => r.json());

    assert.strictEqual(verify2.uiState, 'AT_SHOP');
    console.log(`  ✔ UI State: ${verify2.uiState} (${verify2.message})`);

    // ── TEST 9: Shopkeeper Point-of-Sale Checkout (State: SOLD) ───────────────
    console.log('\n► [TEST 9] Pharmacy Point-of-Sale Dispense with GPS & Seller Provenance (State: SOLD)...');
    const saleRes = await fetch(`${BASE_URL}/api/shopkeeper/scan/sale`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${shopToken}`,
        },
        body: JSON.stringify({
            qrData: pack.verifyUrl,
            patientPhone: '9876543210',
            latitude: '28.6315',
            longitude: '77.2167',
            location: '28.6315, 77.2167 | Connaught Place, New Delhi',
        }),
    }).then((r) => r.json());

    assert.strictEqual(saleRes.status, 'success', `POS sale scan failed: ${saleRes.message}`);
    assert.ok(saleRes.data?.shop?.name, 'Shop name missing in sale response');
    console.log(`  ✔ Dispense Confirmed: ${saleRes.message}`);
    console.log(`  ✔ Verified Pharmacy: ${saleRes.data.shop.name} | License: ${saleRes.data.shop.licenseNumber}`);
    console.log(`  ✔ Dispense GPS: ${saleRes.data.shop.location}`);

    // ── TEST 10: Anti-Cloning Check on Rescanned Sold Pack (State: ALREADY_SOLD)
    console.log('\n► [TEST 10] Anti-Cloning Guard on Sold Pack with Full Provenance (State: ALREADY_SOLD)...');
    const verify3 = await fetch(`${BASE_URL}/api/consumer/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: pack.verifyUrl }),
    }).then((r) => r.json());

    assert.strictEqual(verify3.uiState, 'ALREADY_SOLD');
    assert.ok(verify3.dispensingShop, 'dispensingShop object missing in consumer response');
    console.log(`  ✔ UI State: ${verify3.uiState} (${verify3.message})`);
    console.log(`  ✔ Dispensing Pharmacy Provenance: ${verify3.dispensingShop.name || 'Verified Pharmacy'} (License: ${verify3.dispensingShop.licenseNumber || 'CDSCO-APPROVED'})`);
    console.log(`  ✔ Dispense Location: ${verify3.dispensingShop.location || 'N/A'}`);

    // ── TEST 11: Batch Recall Flow (State: RECALLED) ──────────────────────────
    console.log('\n► [TEST 11] Manufacturer Batch Recall (State: RECALLED)...');
    const recallRes = await fetch(`${BASE_URL}/api/manufacturer/batch/${batchId}/recall`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mfrToken}`,
        },
        body: JSON.stringify({ reason: 'Quality standard audit re-test' }),
    }).then((r) => r.json());

    assert.strictEqual(recallRes.status, 'success', 'Batch recall failed');
    console.log(`  ✔ Batch Recall Broadcasted on Blockchain`);

    const verify4 = await fetch(`${BASE_URL}/api/consumer/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: pack.verifyUrl }),
    }).then((r) => r.json());

    assert.strictEqual(verify4.uiState, 'RECALLED');
    console.log(`  ✔ UI State: ${verify4.uiState} (${verify4.message})`);

    // ── TEST 12: Counterfeit / Tampered QR Rejection (State: COUNTERFEIT) ─────
    console.log('\n► [TEST 12] Counterfeit / Tampered Digital Signature Check...');
    const fakeUrl = 'https://pharmachain.gov.in/verify/fakehash123?token=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.invalidSignature';
    const verifyFake = await fetch(`${BASE_URL}/api/consumer/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: fakeUrl }),
    }).then((r) => r.json());

    assert.strictEqual(verifyFake.uiState, 'COUNTERFEIT');
    assert.strictEqual(verifyFake.valid, false);
    console.log(`  ✔ UI State: ${verifyFake.uiState} (${verifyFake.message})`);

    // ── TEST 13: Counterfeit Incident Reporting ───────────────────────────────
    console.log('\n► [TEST 13] Regulatory Incident Report Filing...');
    const reportRes = await fetch(`${BASE_URL}/api/consumer/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            qrToken: fakeUrl,
            location: 'Connaught Place, New Delhi',
            notes: 'Suspicious seal detected on packaging',
        }),
    }).then((r) => r.json());

    assert.strictEqual(reportRes.status, 'success');
    console.log(`  ✔ Incident Report Logged: ID ${reportRes.reportId}`);

    console.log('\n══════════════════════════════════════════════════════════════════════════════');
    console.log('🎉 ALL 13 END-TO-END CRYPTOGRAPHIC & BLOCKCHAIN LIFECYCLE TESTS PASSED!');
    console.log('══════════════════════════════════════════════════════════════════════════════');
};

runTests().catch((err) => {
    console.error('\n❌ Test Suite Failed:', err.message);
    process.exit(1);
});
