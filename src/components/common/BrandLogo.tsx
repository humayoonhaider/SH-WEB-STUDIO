import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'nav' | 'mark' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'dark' | 'light' | 'blue';
}

/**
 * Official Hexagonal SH Web Studio Monogram & Wordmark
 * Features:
 * - Geometric Hexagon Shield Frame with tech border glow
 * - Ultra-clean, bold, and modern 'S' (electric blue) and 'H' (pure white) typography
 * - Perfectly balanced stroke weights (7px), shared baselines, and center crossbar
 */
export const HexagonSHMark: React.FC<{
  className?: string;
  color?: string;
  showHexagon?: boolean;
}> = ({ className = 'w-9 h-9', showHexagon = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      aria-label="SH Web Studio Logo Mark"
    >
      <defs>
        {/* Electric Blue Gradient for S */}
        <linearGradient id="shBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Clean White Gradient for H */}
        <linearGradient id="shWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Outer Hexagon Border Gradient */}
        <linearGradient id="shHexBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
        </linearGradient>

        {/* Subtle Ambient Radial Glow */}
        <radialGradient id="shAmbientGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Blue Backlight */}
      <circle cx="50" cy="50" r="42" fill="url(#shAmbientGlow)" />

      {/* Outer Hexagon Shield Badge */}
      {showHexagon && (
        <path
          d="M 50 6 L 87 27.5 C 89.5 29 91 31.8 91 34.7 L 91 65.3 C 91 68.2 89.5 71 87 72.5 L 50 94 C 47.5 95.5 44.5 95.5 42 94 L 13 72.5 C 10.5 71 9 68.2 9 65.3 L 9 34.7 C 9 31.8 10.5 29 13 27.5 L 42 6 C 44.5 4.5 47.5 4.5 50 6 Z"
          fill="#111217"
          stroke="url(#shHexBorder)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      )}

      {/* 
        The 'S' Character:
        Smooth, bold architectural curve aligned from y=32 to y=70
      */}
      <path
        d="M 44 32.5 H 28 C 23 32.5 19.5 36 19.5 40.5 C 19.5 45.2 23.5 48.2 28.5 49.8 L 35 51.8 C 40.5 53.5 44.5 56.8 44.5 61.8 C 44.5 66.8 41 70 35.5 70 H 20"
        stroke="url(#shBlueGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 
        The 'H' Character:
        Left vertical stem, Center crossbar, and Right vertical stem aligned from y=32.5 to y=70
      */}
      <path
        d="M 55 32.5 V 70 M 55 51.2 H 80 M 80 32.5 V 70"
        stroke="url(#shWhiteGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* High-tech accent node on H crossbar */}
      <circle cx="67.5" cy="51.2" r="2.2" fill="#60A5FA" />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'nav',
  size = 'md',
  className = '',
  theme = 'dark',
}) => {
  const sizeDimensions = {
    sm: { mark: 'w-7 h-7', title: 'text-sm', sub: 'text-[9px]' },
    md: { mark: 'w-9 h-9', title: 'text-base', sub: 'text-[10px]' },
    lg: { mark: 'w-11 h-11', title: 'text-xl', sub: 'text-xs' },
    xl: { mark: 'w-14 h-14', title: 'text-2xl', sub: 'text-sm' },
  }[size];

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-2xl bg-[#17181D] border border-[#262833] p-2.5 shadow-lg ${className}`}
      >
        <HexagonSHMark className={sizeDimensions.mark} />
      </div>
    );
  }

  if (variant === 'mark') {
    return <HexagonSHMark className={`${sizeDimensions.mark} ${className}`} />;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Hexagonal Geometric Icon */}
      <div className="shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <HexagonSHMark className={sizeDimensions.mark} />
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-extrabold tracking-tight font-heading text-blue-500 group-hover:text-blue-400 transition-colors ${sizeDimensions.title}`}>
            SH
          </span>
          <span className={`font-semibold tracking-tight font-heading text-white ${sizeDimensions.title}`}>
            Web Studio
          </span>
        </div>

        {variant === 'full' && (
          <span className={`text-neutral-400 font-sans tracking-tight mt-0.5 ${sizeDimensions.sub}`}>
            We Build Digital Experiences.
          </span>
        )}
      </div>
    </div>
  );
};
