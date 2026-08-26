import React, { useState } from 'react';
import { useAuth } from '../hooks/auth.hooks';
import { Modal } from '../../../components/common/Modal';
import { Mail, KeyRound, ArrowRight } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const ForgotPasswordModal: React.FC = () => {
  const { setAuthView } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'info',
      title: 'Reset Instructions Dispatched',
      message: `Password reset link sent to ${email}`,
    });
    setAuthView('login');
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => setAuthView('login')}
      title="Reset Pharmacy Terminal Credentials"
      subtitle="Enter registered chemist email to receive password reset PIN"
      icon={<KeyRound className="w-5 h-5 text-emerald-500" />}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[var(--text-primary)] mb-1">
            Registered Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="chemist@pharmacy.in"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setAuthView('login')}
            className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-primary)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Send Reset PIN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </Modal>
  );
};
