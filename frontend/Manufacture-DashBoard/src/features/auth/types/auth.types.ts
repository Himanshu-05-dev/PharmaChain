import { ManufacturerProfile } from '../../../types';

export type KYCStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export type AuthViewMode = 'login' | 'register' | 'pending-kyc' | 'forgot-password';

export interface KYCDocumentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  url?: string;
}

export interface ManufacturerRegisterPayload {
  // Step 1: Corporate & Legal Entity
  companyName: string;
  manufacturerId: string;
  companyCode?: string;
  cinNumber: string;
  gstin: string;
  companyType: 'Formulation' | 'API' | 'Biologics / Vaccines' | 'Contract Manufacturing (CMO)';
  headquarters: string;
  website?: string;

  // Step 2: CDSCO Drug Licensing & Compliance
  cdscoLicenseNo: string;
  cdscoRegistration: string;
  issuingAuthority: string;
  licenseIssueDate?: string;
  licenseExpiryDate: string;
  gmpStandard: 'WHO-GMP' | 'Schedule M (India)' | 'EU-GMP' | 'US-FDA cGMP';
  kycDocs: KYCDocumentItem[];

  // Step 3: Manufacturing Plant & Authorized Personnel
  primaryPlantName: string;
  primaryPlantFacilityId: string;
  primaryPlantAddress: string;
  authorizedPersonName: string;
  authorizedPersonRole: string;
  email: string;
  phone: string;
  idProofType?: 'DIN' | 'Aadhaar' | 'PAN' | 'Passport';
  idProofNumber?: string;

  // Step 4: Security Credentials & Key Vault
  password: string;
  confirmPassword?: string;
  keyAlgorithm: 'ES256 (ECDSA P-256)' | string;
  agreeTerms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  manufacturer: ManufacturerProfile;
  message?: string;
  requires2FA?: boolean;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: ManufacturerProfile | null;
  token: string | null;
  kycStatus: KYCStatus;
  authView: AuthViewMode;
  requires2FA: boolean;
  pendingLoginEmail: string | null;
  loading: boolean;
  error: string | null;
}
