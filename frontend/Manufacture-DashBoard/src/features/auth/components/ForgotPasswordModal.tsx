import React, { useState } from 'react';
import { useAuth } from '../hooks/auth.hooks';
import {
  X,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ForgotPasswordModal: React.FC = () => {
  const { setAuthView, forgotPassword, resetPassword, loading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid official corporate email address');
      return;
    }
    setError(null);
    try {
      await forgotPassword(email.trim());
      setStep(2);
    } catch (err) {
      setError('Failed to dispatch OTP. Please check the email.');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter valid security OTP code');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    try {
      await resetPassword({
        email: email.trim(),
        otp,
        newPassword,
      });
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

        {/* Close button */}
        <button
          onClick={() => setAuthView('login')}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-element)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {step === 1 ? 'Recover Password' : 'Set New Password'}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {step === 1
              ? 'Enter your registered manufacturer corporate email to receive a secure CDSCO verification token'
              : `Enter the verification code sent to ${email} and your new password`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                Corporate Official Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. compliance@medcorepharma.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Dispatching OTP...</span>
                </>
              ) : (
                <>
                  <span>Dispatch Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                6-Digit Security OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 123456"
                className="w-full text-center tracking-[0.4em] font-mono py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Set New Password & Return to Login</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setAuthView('login')}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Return to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
