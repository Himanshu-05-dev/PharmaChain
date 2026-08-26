import React, { useState } from 'react';
import { useDashboard } from '../../features/dashboard/Hooks/dashboard.hooks';
import { useAuth } from '../../features/auth/hooks/auth.hooks';
import {
  Store,
  FileCheck2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Save,
  Building,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PharmacyProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    shopName: user?.shopName || '',
    ownerName: user?.ownerName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    licenseNumber: user?.licenseNumber || '',
    gstin: user?.gstin || '',
    pharmacistRegNo: user?.pharmacistRegNo || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-base shadow-md shadow-emerald-600/25 shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{formData.shopName}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Active License
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              CDSCO Form 20/21 Retail Drug Establishment
            </p>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pharmacy Details Card */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle space-y-4 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] pb-2.5">
            Retail Establishment & Contact
          </h3>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">Pharmacy Trade Name</label>
            <input
              type="text"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">Registered Pharmacist in Charge</label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Statutory Regulatory Licenses */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] shadow-subtle space-y-4 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] pb-2.5">
            CDSCO & Council Statutory Credentials
          </h3>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">Drug License (Form 20/21)</label>
            <input
              type="text"
              value={formData.licenseNumber}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono font-bold opacity-80 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">Pharmacy Council Registration</label>
            <input
              type="text"
              value={formData.pharmacistRegNo}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono opacity-80 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">GSTIN</label>
            <input
              type="text"
              value={formData.gstin}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono opacity-80 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
