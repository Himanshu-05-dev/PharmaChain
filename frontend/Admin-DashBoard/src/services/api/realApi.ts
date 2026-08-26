import { apiClient } from './client';
import {
  DashboardStats,
  ManufacturerRecord,
  ShopkeeperRecord,
  AuditLogEntry,
  AdminUser,
  PaginatedResponse,
} from '../../types/admin';

export const realApi = {
  // ── Authentication ────────────────────────────────────────────────────────
  async login(credentials: { email: string; password?: string }): Promise<{ token: string; user: AdminUser }> {
    const res = await apiClient.post('/api/admin/auth/login', credentials);
    return {
      token: res.data.token,
      user: res.data.data,
    };
  },

  async getCurrentUser(): Promise<AdminUser> {
    const res = await apiClient.get('/api/admin/auth/me');
    return res.data.data;
  },

  // ── Dashboard Overview ───────────────────────────────────────────────────
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get('/api/admin/dashboard/stats');
    return res.data.data;
  },

  // ── Manufacturer KYC Approvals ───────────────────────────────────────────
  async getManufacturers(params?: { status?: string; search?: string }): Promise<PaginatedResponse<ManufacturerRecord>> {
    const res = await apiClient.get('/api/admin/manufacturers', { params });
    const payload = res.data;
    if (Array.isArray(payload)) {
      return {
        status: 'success',
        pagination: { page: 1, limit: payload.length, total: payload.length, totalPages: 1 },
        data: payload,
      };
    }
    return payload;
  },

  async getManufacturerById(id: string): Promise<ManufacturerRecord> {
    const res = await apiClient.get(`/api/admin/manufacturers/${id}`);
    return res.data.data || res.data;
  },

  async approveManufacturer(
    id: string,
    _adminUser?: AdminUser,
    reason?: string
  ): Promise<{ status: string; keyId: string; publicKeyPem: string; manufacturer: ManufacturerRecord }> {
    const payload = {
      reason: reason || 'KYC documentation and drug manufacturing license verified.',
    };
    const res = await apiClient.post(`/api/admin/manufacturers/${id}/approve`, payload);
    const data = res.data.data || res.data;
    return {
      status: 'success',
      keyId: data.keyId || `KEY_${id.slice(-6).toUpperCase()}`,
      publicKeyPem: data.publicKeyPem || '',
      manufacturer: {
        manufacturerId: data.manufacturerId || id,
        companyName: data.companyName || 'Approved Manufacturer',
        kycStatus: 'APPROVED',
        hasSigningKey: true,
        ...data,
      } as any,
    };
  },

  async rejectManufacturer(
    id: string,
    reason: string,
    _adminUser?: AdminUser
  ): Promise<{ status: string; manufacturer: ManufacturerRecord }> {
    const payload = {
      reason: reason || 'KYC submission rejected due to verification discrepancy.',
    };
    const res = await apiClient.post(`/api/admin/manufacturers/${id}/reject`, payload);
    const data = res.data.data || res.data;
    return {
      status: 'success',
      manufacturer: {
        manufacturerId: data.manufacturerId || id,
        companyName: data.companyName || 'Rejected Manufacturer',
        kycStatus: 'REJECTED',
        ...data,
      } as any,
    };
  },

  // ── Pharmacy / Shopkeeper Approvals ──────────────────────────────────────
  async getShopkeepers(params?: { status?: string; search?: string; licenseType?: string }): Promise<PaginatedResponse<ShopkeeperRecord>> {
    const res = await apiClient.get('/api/admin/shopkeepers', { params });
    const payload = res.data;
    if (Array.isArray(payload)) {
      return {
        status: 'success',
        pagination: { page: 1, limit: payload.length, total: payload.length, totalPages: 1 },
        data: payload,
      };
    }
    return payload;
  },

  async getShopkeeperById(id: string): Promise<ShopkeeperRecord> {
    const res = await apiClient.get(`/api/admin/shopkeepers/${id}`);
    return res.data.data || res.data;
  },

  async approveShopkeeper(
    id: string,
    _adminUser?: AdminUser,
    reason?: string
  ): Promise<{ status: string; shopkeeper: ShopkeeperRecord }> {
    const payload = {
      reason: reason || 'Drug license (Form 20/21 or 20B/21B) verified against State Pharmacy Council.',
    };
    const res = await apiClient.post(`/api/admin/shopkeepers/${id}/approve`, payload);
    const data = res.data.data || res.data;
    return {
      status: 'success',
      shopkeeper: {
        shopId: data.shopkeeperId || data.shopId || id,
        shopName: data.shopName || 'Approved Pharmacy',
        verificationStatus: 'approved',
        ...data,
      } as any,
    };
  },

  async rejectShopkeeper(
    id: string,
    reason: string,
    _adminUser?: AdminUser
  ): Promise<{ status: string; shopkeeper: ShopkeeperRecord }> {
    const payload = {
      reason: reason || 'Pharmacy verification rejected.',
    };
    const res = await apiClient.post(`/api/admin/shopkeepers/${id}/reject`, payload);
    const data = res.data.data || res.data;
    return {
      status: 'success',
      shopkeeper: {
        shopId: data.shopkeeperId || data.shopId || id,
        shopName: data.shopName || 'Rejected Pharmacy',
        verificationStatus: 'rejected',
        ...data,
      } as any,
    };
  },

  async suspendShopkeeper(
    id: string,
    reason: string,
    _adminUser?: AdminUser
  ): Promise<{ status: string; shopkeeper: ShopkeeperRecord }> {
    const payload = {
      reason: reason || 'Pharmacy license suspended due to regulatory non-compliance.',
    };
    const res = await apiClient.post(`/api/admin/shopkeepers/${id}/suspend`, payload);
    const data = res.data.data || res.data;
    return {
      status: 'success',
      shopkeeper: {
        shopId: data.shopkeeperId || data.shopId || id,
        shopName: data.shopName || 'Suspended Pharmacy',
        verificationStatus: 'suspended',
        ...data,
      } as any,
    };
  },

  // ── Audit Logs ───────────────────────────────────────────────────────────
  async getAuditLogs(params?: { targetType?: string; action?: string; search?: string }): Promise<PaginatedResponse<AuditLogEntry>> {
    const res = await apiClient.get('/api/admin/audit-logs', { params });
    const payload = res.data;
    if (Array.isArray(payload)) {
      return {
        status: 'success',
        pagination: { page: 1, limit: payload.length, total: payload.length, totalPages: 1 },
        data: payload,
      };
    }
    return payload;
  },
};
