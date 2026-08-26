export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'suspended';

export interface Shopkeeper {
  id?: string;
  shopId: string;
  shopName: string;
  ownerName: string;
  ownerPhone?: string;
  ownerEmail?: string;
  shopPhone?: string;
  shopEmail?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  drugLicenseNumber?: string;
  licenseType?: 'retail' | 'wholesale' | 'other' | string;
  issuingAuthority?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  licenseDocumentUrl?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  role?: string;
  verifiedAt?: string;
}

export interface RegistrationForm {
  // Step 1: Shop Information
  shopName: string;
  shopPhone: string;
  shopEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  // Step 2: Owner Information
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;

  // Step 3: Pharmaceutical License & Password
  drugLicenseNumber: string;
  licenseType: 'retail' | 'wholesale' | 'other';
  issuingAuthority: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  licenseDocument: {
    name: string;
    uri?: string;
    size?: number;
    mimeType?: string;
  } | null;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface LoginResponse {
  success: boolean;
  shopkeeper: Shopkeeper;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  shopId?: string;
  shopkeeper?: Shopkeeper;
}

export interface VerificationStatusResponse {
  success: boolean;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  shopId?: string;
  shopName?: string;
}
