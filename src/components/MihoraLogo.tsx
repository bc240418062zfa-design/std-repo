import React from 'react';
import { motion } from 'motion/react';

interface MihoraLogoProps {
  variant?: 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const MihoraLogo: React.FC<MihoraLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', textTitle: 'text-[17px]', textSub: 'text-[9.5px]' },
    md: { icon: 'w-10 h-10', textTitle: 'text-xl', textSub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', textTitle: 'text-2xl', textSub: 'text-xs' }
  };

  const currentSize = sizeMap[size];
  const isWhite = variant === 'white';

  return (
    <div className={`group/logo inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek Modern Architectural Monogram with micro-spring hover */}
      <motion.div
        whileHover={{ rotate: -4, scale: 1.07 }}
        transition={{ type: 'spring', stiffness: 420, damping: 20 }}
        className={`relative shrink-0 ${currentSize.icon}`}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`m-bg-${variant}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isWhite ? '#FFFFFF' : '#1E3A8A'} />
              <stop offset="100%" stopColor={isWhite ? '#E2E8F0' : '#091122'} />
            </linearGradient>
            <linearGradient id={`m-gold-${variant}`} x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="16"
            fill={`url(#m-bg-${variant})`}
            stroke={isWhite ? 'rgba(255,255,255,0.2)' : 'rgba(37,99,235,0.22)'}
            strokeWidth="1.5"
          />

          {/* Architectural Open Book / M Ribbon */}
          <path
            d="M17 44V22L32 34L47 22V44"
            stroke={isWhite ? '#091122' : '#FFFFFF'}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Precision Apex Node */}
          <circle cx="32" cy="19" r="3.5" fill={`url(#m-gold-${variant})`} />
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col justify-center text-left leading-none">
          <span
            className={`font-extrabold tracking-tight whitespace-nowrap ${currentSize.textTitle} ${
              isWhite ? 'text-white' : 'text-slate-950'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            MIHORA <span className={isWhite ? 'text-sky-300' : 'text-blue-700'}>VU</span>
          </span>
          <span
            className={`font-mono font-semibold uppercase tracking-[0.16em] mt-0.5 whitespace-nowrap ${currentSize.textSub} ${
              isWhite ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Study Library
          </span>
        </div>
      )}
    </div>
  );
};
