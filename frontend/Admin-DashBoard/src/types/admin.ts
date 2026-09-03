// ── Admin Identity ────────────────────────────────────────────────────────────
export type AdminRole = 'SUPERADMIN' | 'DRUG_INSPECTOR' | 'COMPLIANCE_AUDITOR';

export interface AdminUser {
  adminId: string;
  email: string;
  fullName: string;
  department: string;
  role: AdminRole;
  createdAt: string;
}

export interface AdminAuthResponse {
  status: 'success';
  token: string;
  data: AdminUser;
}

// ── Dashboard Metrics ─────────────────────────────────────────────────────────
export interface DashboardStats {
  manufacturers: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  shopkeepers: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
  };
  cryptography: {
    activeKeys: number;
    algorithm: string;
  };
  urgentActionRequired: number;
}

// ── Manufacturer Verification Types ───────────────────────────────────────────
export type ManufacturerKycStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';

export interface ManufacturerKycDocument {
  id: string;
  name: string;
  type: string;
  size?: number;
  uploadDate?: string;
  status?: string;
  url?: string;
}

export interface ManufacturerRecord {
  manufacturerId: string;
  companyName: string;
  companyCode?: string;
  cinNumber?: string;
  gstin?: string;
  companyType?: string;
  headquarters?: string;
  website?: string;

  // License & CDSCO Details
  licenseNumber: string;
  cdscoRegistration?: string;
  issuingAuthority?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  gmpStandard?: string;

  // Manufacturing Facilities
  plantName?: string;
  primaryPlantName?: string;
  facilityId?: string;
  primaryPlantFacilityId?: string;
  plantAddress?: string;
  primaryPlantAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;

  // Authorized Signatory & Personnel
  authorizedPersonName?: string;
  directorName?: string;
  authorizedPersonRole?: string;
  phone?: string;
  idProofType?: string;
  idProofNumber?: string;

  // Uploaded Compliance Documents
  kycDocs?: ManufacturerKycDocument[];

  // Authentication & Status
  email: string;
  kycStatus: ManufacturerKycStatus;
  createdAt: string;
  updatedAt?: string;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  blockedReason?: string | null;
  blockedAt?: string | null;

  // Cryptographic Key Details
  hasSigningKey: boolean;
  keyAlgorithm?: string;
  publicKeyPem?: string | null;
  keyDetails?: {
    keyId?: string;
    algorithm?: string;
    publicKeyPem?: string;
    status?: string;
    createdAt?: string;
  } | null;
}

// ── Shopkeeper Verification Types ─────────────────────────────────────────────
export type ShopkeeperStatus = 'pending' | 'verified' | 'approved' | 'rejected' | 'suspended';
export type LicenseType = 'retail' | 'wholesale' | 'other';

export interface ShopkeeperRecord {
  shopId: string;
  shopName: string;
  shopPhone: string;
  shopEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  drugLicenseNumber: string;
  licenseType: LicenseType;
  issuingAuthority: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  documentUrl?: string | null;
  documentMeta?: {
    name: string;
    size: number;
    mimeType: string;
  } | null;
  verificationStatus: ShopkeeperStatus;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
}

// ── Audit Trail ───────────────────────────────────────────────────────────────
export interface AuditLogEntry {
  _id: string;
  action: string;
  performedBy: {
    adminId: string;
    fullName: string;
    email: string;
    role: string;
  };
  targetType: 'MANUFACTURER' | 'SHOPKEEPER' | 'ADMIN' | 'SYSTEM';
  targetId: string;
  targetName?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

// ── Common Pagination Envelope ────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  status: 'success';
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}
