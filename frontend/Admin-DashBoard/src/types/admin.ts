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
export type ManufacturerKycStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ManufacturerRecord {
  manufacturerId: string;
  companyName: string;
  licenseNumber: string;
  email: string;
  kycStatus: ManufacturerKycStatus;
  createdAt: string;
  updatedAt?: string;
  hasSigningKey: boolean;
  publicKeyPem?: string | null;
  rejectionReason?: string | null;
  state?: string;
  directorName?: string;
  plantAddress?: string;
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
