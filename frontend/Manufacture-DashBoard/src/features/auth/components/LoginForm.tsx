import React, { useState } from 'react';
import { useAuth } from '../hooks/auth.hooks';
import { PharmaChainLogo } from '../../../components/common/PharmaChainLogo';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const LoginForm: React.FC = () => {
  const {
    login,
    verify2FA,
    setAuthView,
    requires2FA,
    pendingLoginEmail,
    loading,
    error,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) {
      errs.email = 'Corporate email or Manufacturer ID is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requires2FA) {
      if (!twoFactorCode || twoFactorCode.length < 6) {
        setFieldErrors({ twoFactorCode: 'Please enter valid 6-digit security token' });
        return;
      }
      await verify2FA(twoFactorCode);
      return;
    }

    if (!validate()) return;

    try {
      await login({
        email: email.trim(),
        password,
        rememberMe,
      });
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Sleek Modern Card */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-colors">
        {/* Top subtle amber halo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header with PharmaChain Logo */}
        <div className="text-center mb-7 relative z-10">
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <PharmaChainLogo size={44} withGlow={true} />
            <span className="font-black text-2xl tracking-tight text-[var(--text-primary)]">
              PharmaChain
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {requires2FA ? 'Two-Factor Authentication' : 'Manufacturer Portal Sign In'}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
            {requires2FA
              ? `Enter the 6-digit security code sent to ${pendingLoginEmail}`
              : 'Enter your authorized CDSCO manufacturing credentials'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-[var(--alert-danger-bg)] border border-[var(--alert-danger-border)] text-[var(--alert-danger-text)] text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Minimalist Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!requires2FA ? (
            <>
              {/* Corporate Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Corporate Email / Plant ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail className="w-4 h-4 opacity-70" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => {
                          const n = { ...prev };
                          delete n.email;
                          return n;
                        });
                      }
                    }}
                    placeholder="name@company.com"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-element)] border ${
                      fieldErrors.email
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-[var(--border)] focus:border-amber-500'
                    } text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-medium`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[var(--text-primary)]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot-password')}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold transition-colors cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4 opacity-70" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => {
                          const n = { ...prev };
                          delete n.password;
                          return n;
                        });
                      }
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--bg-element)] border ${
                      fieldErrors.password
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-[var(--border)] focus:border-amber-500'
                    } text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-rose-500 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Remember checkbox & Security tag */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[var(--border)] text-amber-500 focus:ring-amber-500 bg-[var(--bg-element)] cursor-pointer"
                  />
                  <span className="text-xs text-[var(--text-muted)]">Remember me</span>
                </label>
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                  <span>256-bit TLS</span>
                </span>
              </div>
            </>
          ) : (
            /* 2FA Challenge */
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[var(--text-primary)] text-center">
                6-Digit Security Token
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] text-lg font-mono py-2.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] focus:border-amber-500 text-[var(--text-primary)] focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-bold"
                autoFocus
              />
              {fieldErrors.twoFactorCode && (
                <p className="text-[11px] text-rose-500 text-center font-medium">
                  {fieldErrors.twoFactorCode}
                </p>
              )}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : requires2FA ? (
              <span>Verify & Continue</span>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Prompt */}
        <div className="mt-6 pt-5 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)] relative z-10">
          <span>New manufacturing unit? </span>
          <button
            onClick={() => setAuthView('register')}
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline transition-colors cursor-pointer"
          >
            Register Unit (KYC)
          </button>
        </div>
      </div>
    </div>
  );
};
