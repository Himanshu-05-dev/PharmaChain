import React, { useState } from 'react';
import { useAuth } from '../hooks/auth.hooks';
import {
  Store,
  FileCheck2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const RegisterWizard: React.FC = () => {
  const { setAuthView, switchDemoAccount } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    gstin: '',
    pharmacistRegNo: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      showToast({
        type: 'success',
        title: 'Pharmacy Application Submitted',
        message: 'CDSCO Drug Inspector has been notified for Form 20/21 verification.',
      });
      switchDemoAccount('PENDING');
      setAuthView('pending-kyc');
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Pharmacy License Registration
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Step {step} of 3 — Register retail chemist entity for blockchain verification
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-emerald-500'
                  : s < step
                  ? 'w-4 bg-emerald-600'
                  : 'w-4 bg-[var(--bg-element)] border border-[var(--border)]'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-4 text-xs">
        {step === 1 && (
          <>
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">Pharmacy / Chemist Name</label>
              <input
                required
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="e.g. Apollo MedPlus Pharmacy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">Registered Pharmacist in Charge</label>
              <input
                required
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. Dr. Rajesh Sharma, B.Pharm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Official Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="chemist@medplus.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98112 34567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">Retail Drug License No. (Form 20/21)</label>
              <input
                required
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="e.g. DL-20-B-2023-88741"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">Pharmacy Council Reg. Number</label>
              <input
                required
                type="text"
                value={formData.pharmacistRegNo}
                onChange={(e) => setFormData({ ...formData, pharmacistRegNo: e.target.value })}
                placeholder="e.g. PCI-DEL-48201-B"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">GSTIN</label>
              <input
                required
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                placeholder="e.g. 07AAAAA0000A1Z5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">Shop Premise Address</label>
              <input
                required
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Shop No., Street, Market area"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">City</label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New Delhi"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">State</label>
                <input
                  required
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Delhi"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Pincode</label>
                <input
                  required
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="110001"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAuthView('login')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Cancel & Return
            </button>
          )}

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto"
          >
            <span>{step === 3 ? 'Submit for License Verification' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
