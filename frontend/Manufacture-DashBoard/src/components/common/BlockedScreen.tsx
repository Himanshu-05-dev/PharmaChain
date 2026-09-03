import React, { useState } from 'react';
import { ShieldX, LogOut, AlertTriangle, Clock, Phone, Mail, Building2, RefreshCw, ChevronRight } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/auth.hooks';

interface BlockedScreenProps {
  reason?: string;
  blockedAt?: string;
  companyName?: string;
  email?: string;
}

export const BlockedScreen: React.FC<BlockedScreenProps> = ({
  reason,
  blockedAt,
  companyName,
  email,
}) => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  const formattedDate = blockedAt
    ? new Date(blockedAt).toLocaleString('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      })
    : null;

  return (
    <div className="bs-root">
      {/* ── Background ── */}
      <div className="bs-bg">
        <div className="bs-orb bs-orb-1" />
        <div className="bs-orb bs-orb-2" />
        <div className="bs-grid" />
      </div>

      {/* ── Scrollable content wrapper ── */}
      <div className="bs-scroll">
        <div className="bs-card">

          {/* ── Icon ── */}
          <div className="bs-icon-wrap">
            <div className="bs-icon-ring bs-icon-ring-3" />
            <div className="bs-icon-ring bs-icon-ring-2" />
            <div className="bs-icon-ring bs-icon-ring-1" />
            <div className="bs-icon-core">
              <ShieldX className="bs-shield-icon" />
            </div>
          </div>

          {/* ── Badge ── */}
          <div className="bs-badge">
            <AlertTriangle className="bs-badge-icon" />
            <span>REGULATORY ACTION — CDSCO</span>
          </div>

          {/* ── Heading ── */}
          <div className="bs-heading-block">
            <h1 className="bs-title">Account Suspended</h1>
            <p className="bs-subtitle">
              Your manufacturer account has been blocked by the Central Drugs Standard Control
              Organisation (CDSCO). All platform operations have been suspended pending
              compliance review.
            </p>
          </div>

          {/* ── Detail rows ── */}
          <div className="bs-details">
            {companyName && (
              <div className="bs-detail">
                <Building2 className="bs-detail-icon" />
                <div className="bs-detail-text">
                  <span className="bs-detail-label">Registered Entity</span>
                  <span className="bs-detail-value">{companyName}</span>
                </div>
              </div>
            )}

            {reason && (
              <div className="bs-detail bs-detail--warn">
                <AlertTriangle className="bs-detail-icon bs-detail-icon--warn" />
                <div className="bs-detail-text">
                  <span className="bs-detail-label">Reason for Block</span>
                  <span className="bs-detail-value bs-detail-value--warn">{reason}</span>
                </div>
              </div>
            )}

            {formattedDate && (
              <div className="bs-detail">
                <Clock className="bs-detail-icon" />
                <div className="bs-detail-text">
                  <span className="bs-detail-label">Action Timestamp (IST)</span>
                  <span className="bs-detail-value">{formattedDate}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Resolution steps ── */}
          <div className="bs-steps">
            <p className="bs-steps-title">How to resolve this</p>
            <ul className="bs-steps-list">
              <li>
                <ChevronRight className="bs-step-arrow" />
                <span>Review the reason for the block and identify any compliance gaps.</span>
              </li>
              <li>
                <ChevronRight className="bs-step-arrow" />
                <span>Contact the CDSCO regulatory authority with the required documentation.</span>
              </li>
              <li>
                <ChevronRight className="bs-step-arrow" />
                <span>Once compliance is restored, your account administrator will reinstate your access.</span>
              </li>
            </ul>
          </div>

          {/* ── Divider ── */}
          <div className="bs-divider" />

          {/* ── Actions ── */}
          <div className="bs-actions">
            <a href="mailto:cdsco-support@nic.in" className="bs-btn bs-btn--ghost">
              <Mail className="bs-btn-icon" />
              Contact CDSCO
            </a>
            <a href="tel:+911123236975" className="bs-btn bs-btn--ghost">
              <Phone className="bs-btn-icon" />
              Helpline
            </a>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bs-btn bs-btn--danger"
            >
              {isLoggingOut
                ? <RefreshCw className="bs-btn-icon bs-spin" />
                : <LogOut className="bs-btn-icon" />
              }
              {isLoggingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>

          {/* ── Email note ── */}
          {email && (
            <p className="bs-email-note">
              If you believe this is an error, contact your administrator at <strong>{email}</strong>.
            </p>
          )}

        </div>
      </div>
    </div>
  );
};
