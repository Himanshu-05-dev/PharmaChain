import React from 'react';

interface PharmaChainLogoProps {
  className?: string;
  size?: number | string;
  withGlow?: boolean;
}

export const PharmaChainLogo: React.FC<PharmaChainLogoProps> = ({
  className = '',
  size = 36,
  withGlow = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {withGlow && (
        <div className="absolute inset-0 bg-amber-500/25 rounded-full blur-md -z-10 animate-pulse" />
      )}
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs transition-transform duration-300"
      >
        <defs>
          <linearGradient id="pcBrandGrad" x1="20" y1="20" x2="180" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>

        {/* Upper Right Hexagon */}
        <path
          d="M130 18 L180 47 L180 105 L130 134 L80 105 L80 47 Z"
          stroke="url(#pcBrandGrad)"
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Lower Left Hexagon */}
        <path
          d="M70 86 L120 115 L120 173 L70 202 L20 173 L20 115 Z"
          stroke="url(#pcBrandGrad)"
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Interlocking 'P' / Chain Link Monogram */}
        <path
          d="M70 173 L70 65 Q70 42 95 42 L115 42 Q140 42 140 68 Q140 94 115 94 L70 94"
          stroke="url(#pcBrandGrad)"
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default PharmaChainLogo;
