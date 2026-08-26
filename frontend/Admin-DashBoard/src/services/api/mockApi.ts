import {
  DashboardStats,
  ManufacturerRecord,
  ShopkeeperRecord,
  AuditLogEntry,
  AdminUser,
  PaginatedResponse,
} from '../../types/admin';
import {
  MOCK_STATS,
  MOCK_MANUFACTURERS,
  MOCK_SHOPKEEPERS,
  MOCK_AUDIT_LOGS,
  MOCK_ADMIN_USER,
} from './fixtures';

// Helper to simulate network latency
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Persistent local state clones
let manufacturersState: ManufacturerRecord[] = [...MOCK_MANUFACTURERS];
let shopkeepersState: ShopkeeperRecord[] = [...MOCK_SHOPKEEPERS];
let auditLogsState: AuditLogEntry[] = [...MOCK_AUDIT_LOGS];

// Re-calculate statistics dynamically
const computeStats = (): DashboardStats => {
  const mPending = manufacturersState.filter((m) => m.kycStatus === 'PENDING').length;
  const mApproved = manufacturersState.filter((m) => m.kycStatus === 'APPROVED').length;
  const mRejected = manufacturersState.filter((m) => m.kycStatus === 'REJECTED').length;

  const sPending = shopkeepersState.filter((s) => s.verificationStatus === 'pending').length;
  const sApproved = shopkeepersState.filter((s) => s.verificationStatus === 'approved' || s.verificationStatus === 'verified').length;
  const sRejected = shopkeepersState.filter((s) => s.verificationStatus === 'rejected').length;
  const sSuspended = shopkeepersState.filter((s) => s.verificationStatus === 'suspended').length;

  const activeKeys = manufacturersState.filter((m) => m.hasSigningKey).length;

  return {
    manufacturers: {
      total: manufacturersState.length,
      pending: mPending,
      approved: mApproved,
      rejected: mRejected,
    },
    shopkeepers: {
      total: shopkeepersState.length,
      pending: sPending,
      approved: sApproved,
      rejected: sRejected,
      suspended: sSuspended,
    },
    cryptography: {
      activeKeys,
      algorithm: 'ECDSA P-256 (SHA-256 / secp256r1)',
    },
    urgentActionRequired: mPending + sPending,
  };
};

export const mockApi = {
  // ── Authentication ────────────────────────────────────────────────────────
  async login(credentials: { email: string; password?: string }): Promise<{ token: string; user: AdminUser }> {
    await delay(450);
    if (credentials.email === 'invalid@test.com') {
      throw new Error('Invalid government officer credentials or inactive officer account.');
    }
    return {
      token: `mock_jwt_admin_${Date.now()}`,
      user: {
        ...MOCK_ADMIN_USER,
        email: credentials.email || MOCK_ADMIN_USER.email,
      },
    };
  },

  async getCurrentUser(): Promise<AdminUser> {
    await delay(200);
    return MOCK_ADMIN_USER;
  },

  // ── Dashboard Overview ───────────────────────────────────────────────────
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(350);
    return computeStats();
  },

  // ── Manufacturer KYC Approvals ───────────────────────────────────────────
  async getManufacturers(params?: { status?: string; search?: string }): Promise<PaginatedResponse<ManufacturerRecord>> {
    await delay(400);
    let list = [...manufacturersState];

    if (params?.status && params.status !== 'ALL') {
      list = list.filter((m) => m.kycStatus === params.status);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.companyName.toLowerCase().includes(q) ||
          m.licenseNumber.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.manufacturerId.toLowerCase().includes(q)
      );
    }

    return {
      status: 'success',
      pagination: {
        page: 1,
        limit: 50,
        total: list.length,
        totalPages: 1,
      },
      data: list,
    };
  },

  async getManufacturerById(id: string): Promise<ManufacturerRecord> {
    await delay(250);
    const found = manufacturersState.find((m) => m.manufacturerId === id);
    if (!found) throw new Error(`Manufacturer ${id} not found in CDSCO registry.`);
    return found;
  },

  async approveManufacturer(
    id: string,
    adminUser: AdminUser
  ): Promise<{ status: string; keyId: string; publicKeyPem: string; manufacturer: ManufacturerRecord }> {
    await delay(600);
    const index = manufacturersState.findIndex((m) => m.manufacturerId === id);
    if (index === -1) throw new Error('Manufacturer record not found.');

    const pubKey = `-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE${Math.random().toString(36).substring(2).toUpperCase()}8F29A71X\n${Math.random().toString(36).substring(2).toUpperCase()}1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6==\n-----END PUBLIC KEY-----`;

    const updated: ManufacturerRecord = {
      ...manufacturersState[index],
      kycStatus: 'APPROVED',
      hasSigningKey: true,
      publicKeyPem: pubKey,
      updatedAt: new Date().toISOString(),
    };

    manufacturersState[index] = updated;

    // Record audit event
    const auditEntry: AuditLogEntry = {
      _id: `LOG_${Date.now()}`,
      action: 'MANUFACTURER_APPROVED',
      performedBy: {
        adminId: adminUser.adminId,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role,
      },
      targetType: 'MANUFACTURER',
      targetId: id,
      targetName: updated.companyName,
      metadata: {
        keyAlgorithm: 'ECDSA P-256',
        keystoreId: `KEY_${id.substring(0, 10)}_P256`,
        action: 'PROVISION_SIGNING_KEY',
      },
      createdAt: new Date().toISOString(),
      ipAddress: '10.244.0.15',
    };
    auditLogsState.unshift(auditEntry);

    return {
      status: 'success',
      keyId: `KEY_${id}_P256`,
      publicKeyPem: pubKey,
      manufacturer: updated,
    };
  },

  async rejectManufacturer(
    id: string,
    reason: string,
    adminUser: AdminUser
  ): Promise<{ status: string; manufacturer: ManufacturerRecord }> {
    await delay(500);
    const index = manufacturersState.findIndex((m) => m.manufacturerId === id);
    if (index === -1) throw new Error('Manufacturer record not found.');

    const updated: ManufacturerRecord = {
      ...manufacturersState[index],
      kycStatus: 'REJECTED',
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
    };

    manufacturersState[index] = updated;

    // Record audit event
    const auditEntry: AuditLogEntry = {
      _id: `LOG_${Date.now()}`,
      action: 'MANUFACTURER_REJECTED',
      performedBy: {
        adminId: adminUser.adminId,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role,
      },
      targetType: 'MANUFACTURER',
      targetId: id,
      targetName: updated.companyName,
      reason,
      createdAt: new Date().toISOString(),
      ipAddress: '10.244.0.15',
    };
    auditLogsState.unshift(auditEntry);

    return {
      status: 'success',
      manufacturer: updated,
    };
  },

  // ── Pharmacy / Shopkeeper Approvals ──────────────────────────────────────
  async getShopkeepers(params?: { status?: string; search?: string; licenseType?: string }): Promise<PaginatedResponse<ShopkeeperRecord>> {
    await delay(400);
    let list = [...shopkeepersState];

    if (params?.status && params.status !== 'all') {
      list = list.filter((s) => s.verificationStatus === params.status);
    }

    if (params?.licenseType && params.licenseType !== 'all') {
      list = list.filter((s) => s.licenseType === params.licenseType);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.shopName.toLowerCase().includes(q) ||
          s.ownerName.toLowerCase().includes(q) ||
          s.drugLicenseNumber.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q)
      );
    }

    return {
      status: 'success',
      pagination: {
        page: 1,
        limit: 50,
        total: list.length,
        totalPages: 1,
      },
      data: list,
    };
  },

  async getShopkeeperById(id: string): Promise<ShopkeeperRecord> {
    await delay(250);
    const found = shopkeepersState.find((s) => s.shopId === id);
    if (!found) throw new Error(`Pharmacy ${id} not found.`);
    return found;
  },

  async approveShopkeeper(id: string, adminUser: AdminUser): Promise<{ status: string; shopkeeper: ShopkeeperRecord }> {
    await delay(500);
    const index = shopkeepersState.findIndex((s) => s.shopId === id);
    if (index === -1) throw new Error('Pharmacy record not found.');

    const updated: ShopkeeperRecord = {
      ...shopkeepersState[index],
      verificationStatus: 'approved',
      verifiedAt: new Date().toISOString(),
    };

    shopkeepersState[index] = updated;

    // Record audit event
    const auditEntry: AuditLogEntry = {
      _id: `LOG_${Date.now()}`,
      action: 'SHOPKEEPER_APPROVED',
      performedBy: {
        adminId: adminUser.adminId,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role,
      },
      targetType: 'SHOPKEEPER',
      targetId: id,
      targetName: updated.shopName,
      metadata: {
        licenseNumber: updated.drugLicenseNumber,
        licenseType: updated.licenseType,
      },
      createdAt: new Date().toISOString(),
      ipAddress: '10.244.0.15',
    };
    auditLogsState.unshift(auditEntry);

    return {
      status: 'success',
      shopkeeper: updated,
    };
  },

  async rejectShopkeeper(
    id: string,
    reason: string,
    adminUser: AdminUser
  ): Promise<{ status: string; shopkeeper: ShopkeeperRecord }> {
    await delay(500);
    const index = shopkeepersState.findIndex((s) => s.shopId === id);
    if (index === -1) throw new Error('Pharmacy record not found.');

    const updated: ShopkeeperRecord = {
      ...shopkeepersState[index],
      verificationStatus: 'rejected',
      rejectionReason: reason,
    };

    shopkeepersState[index] = updated;

    // Record audit event
    const auditEntry: AuditLogEntry = {
      _id: `LOG_${Date.now()}`,
      action: 'SHOPKEEPER_REJECTED',
      performedBy: {
        adminId: adminUser.adminId,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role,
      },
      targetType: 'SHOPKEEPER',
      targetId: id,
      targetName: updated.shopName,
      reason,
      createdAt: new Date().toISOString(),
      ipAddress: '10.244.0.15',
    };
    auditLogsState.unshift(auditEntry);

    return {
      status: 'success',
      shopkeeper: updated,
    };
  },

  async suspendShopkeeper(
    id: string,
    reason: string,
    adminUser: AdminUser
  ): Promise<{ status: string; shopkeeper: ShopkeeperRecord }> {
    await delay(500);
    const index = shopkeepersState.findIndex((s) => s.shopId === id);
    if (index === -1) throw new Error('Pharmacy record not found.');

    const updated: ShopkeeperRecord = {
      ...shopkeepersState[index],
      verificationStatus: 'suspended',
      rejectionReason: reason,
    };

    shopkeepersState[index] = updated;

    // Record audit event
    const auditEntry: AuditLogEntry = {
      _id: `LOG_${Date.now()}`,
      action: 'SHOPKEEPER_SUSPENDED',
      performedBy: {
        adminId: adminUser.adminId,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role,
      },
      targetType: 'SHOPKEEPER',
      targetId: id,
      targetName: updated.shopName,
      reason,
      metadata: { directive: 'EMERGENCY_RECALL_FREEZE' },
      createdAt: new Date().toISOString(),
      ipAddress: '10.244.0.15',
    };
    auditLogsState.unshift(auditEntry);

    return {
      status: 'success',
      shopkeeper: updated,
    };
  },

  // ── Audit Logs ───────────────────────────────────────────────────────────
  async getAuditLogs(params?: { targetType?: string; action?: string; search?: string }): Promise<PaginatedResponse<AuditLogEntry>> {
    await delay(350);
    let list = [...auditLogsState];

    if (params?.targetType && params.targetType !== 'ALL') {
      list = list.filter((a) => a.targetType === params.targetType);
    }

    if (params?.action && params.action !== 'ALL') {
      list = list.filter((a) => a.action === params.action);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.action.toLowerCase().includes(q) ||
          a.performedBy.fullName.toLowerCase().includes(q) ||
          (a.targetName && a.targetName.toLowerCase().includes(q)) ||
          a.targetId.toLowerCase().includes(q) ||
          (a.reason && a.reason.toLowerCase().includes(q))
      );
    }

    return {
      status: 'success',
      pagination: {
        page: 1,
        limit: 100,
        total: list.length,
        totalPages: 1,
      },
      data: list,
    };
  },
};
