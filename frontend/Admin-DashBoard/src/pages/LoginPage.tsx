import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@pharmachain.gov.in');
  const [password, setPassword] = useState('GovSecurity2026!#');
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
        message: 'Welcome back, Dr. A. K. Verma. Central Regulatory Keystore connected.',
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {/* Emblem & Portal Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-navy-700 to-emerald-500 mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/30">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <span className="inline-block text-[11px] font-bold text-blue-400 tracking-widest uppercase mb-1 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/40">
            Central Drugs Standard Control Organisation
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            PHARMACHAIN ADMIN PORTAL
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            National Drug KYC Verification & Cryptographic Keystore Authority
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-800">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Government Officer Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="admin@pharmachain.gov.in"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Password & Token
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-950/60 border border-rose-800/80 rounded-lg p-3 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
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
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In as Drug Inspector / Admin
              </Button>
            </div>
          </form>

          {/* Compliance Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Protected by 256-Bit Hardware Security. Unauthorized access attempts are monitored and reported under the Drugs and Cosmetics Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
