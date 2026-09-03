import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Landmark } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { PharmaChainLogo } from '../components/common/PharmaChainLogo';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide officer credentials.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      showToast({
        type: 'success',
        title: 'Officer Session Authenticated',
        message: 'Welcome back. Central Regulatory Keystore connected.',
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#070d18] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Government Strip */}
      <div>
        <div className="gov-tricolor-bar" />
        <div className="bg-[#0b2545] text-slate-200 text-xs px-6 py-2 flex items-center justify-between border-b border-[#133b5c]">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span className="font-bold tracking-wide">भारत सरकार | Government of India</span>
            <span className="hidden sm:inline text-slate-300">• Ministry of Health & Family Welfare</span>
          </div>
          <span className="text-[11px] font-mono bg-blue-900/80 px-2 py-0.5 rounded text-amber-300 font-bold border border-blue-700/50">
            OFFICIAL USE ONLY
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-md">
          {/* Emblem & Portal Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#0c1a30] mx-auto flex items-center justify-center shadow-xl border border-slate-200 dark:border-slate-700 mb-3">
              <PharmaChainLogo size={52} withGlow={true} />
            </div>
            <span className="inline-block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 tracking-widest uppercase mb-1 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-md border border-emerald-300 dark:border-emerald-800">
              Central Drugs Standard Control Organisation
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              PHARMACHAIN ADMIN PORTAL
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
              National Drug KYC Verification & Cryptographic Keystore Authority
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-[#0c1527] py-8 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200 dark:border-slate-800 card-highlight">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Government Officer Email ID
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 pl-9 pr-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                    placeholder="admin@pharmachain.gov.in"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Security Password & Passkey
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 pl-9 pr-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Authorize Officer Access
                </Button>
              </div>
            </form>

            {/* Compliance Disclaimer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Protected by 256-Bit Hardware Security. Unauthorized access attempts are punishable under the Drugs and Cosmetics Act.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Footer */}
      <footer className="bg-white dark:bg-[#0a1426] border-t border-slate-200 dark:border-slate-800 py-3 text-center text-xs text-slate-500">
        <span>© 2026 Central Drugs Standard Control Organisation (CDSCO), Ministry of Health & Family Welfare. All Rights Reserved.</span>
      </footer>
    </div>
  );
};
