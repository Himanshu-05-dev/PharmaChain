import mongoose from 'mongoose';

// ── Constants ─────────────────────────────────────────────────────────────────
export const KYC_STATUS = ['PENDING', 'APPROVED', 'REJECTED', 'BLOCKED', 'SUSPENDED'];

// ── Schema ────────────────────────────────────────────────────────────────────
const ManufacturerSchema = new mongoose.Schema(
    {
        // Domain-unique ID (e.g. MFR_CIPLA_001_A3F) used as blockchain identity
        manufacturerId: { type: String, required: true, unique: true },
        companyName:    { type: String, required: true },
        companyCode:    { type: String, default: null },
        cinNumber:      { type: String, default: null },
        gstin:          { type: String, default: null },
        companyType:    { type: String, default: 'Formulation' },
        headquarters:   { type: String, default: null },
        website:        { type: String, default: null },

        // Drug Licensing & CDSCO Compliance
        licenseNumber:     { type: String, required: true, unique: true },
        cdscoRegistration: { type: String, default: null },
        issuingAuthority:  { type: String, default: 'Central Drugs Standard Control Organisation (CDSCO)' },
        licenseIssueDate:  { type: String, default: null },
        licenseExpiryDate: { type: String, default: null },
        gmpStandard:       { type: String, default: 'WHO-GMP' },

        // Manufacturing Plant / Facility Location
        primaryPlantName:       { type: String, default: null },
        primaryPlantFacilityId: { type: String, default: null },
        primaryPlantAddress:    { type: String, default: null },
        plantAddress:           { type: String, default: null },
        city:                   { type: String, default: null },
        state:                  { type: String, default: null },
        pincode:                { type: String, default: null },

        // Authorized QA Signatory & Personnel
        authorizedPersonName:   { type: String, default: null },
        authorizedPersonRole:   { type: String, default: null },
        phone:                  { type: String, default: null },
        idProofType:            { type: String, default: null },
        idProofNumber:          { type: String, default: null },

        // Uploaded Compliance & KYC Documents
        kycDocs: [
            {
                id:         { type: String },
                name:       { type: String },
                type:       { type: String },
                size:       { type: Number },
                uploadDate: { type: String },
                status:     { type: String, default: 'UPLOADED' },
                url:        { type: String },
            },
        ],

        email:          { type: String, required: true, unique: true, lowercase: true },
        passwordHash:   { type: String, required: true },
        kycStatus:      { type: String, enum: KYC_STATUS, default: 'PENDING' },
        publicKeyPem:   { type: String, default: null },
        publicKeys:     [{ type: String }],
        keyAlgorithm:   { type: String, default: 'ES256 (ECDSA P-256)' },
        rejectionReason:{ type: String, default: null },
        verifiedAt:     { type: Date, default: null },

        // Blocking / Administrative Freeze
        blockedReason:  { type: String, default: null },
        blockedAt:      { type: Date, default: null },
        blockedBy:      { type: String, default: null },
    },
    { timestamps: true },
);

const Manufacturer = mongoose.model('Manufacturer', ManufacturerSchema);
export default Manufacturer;
