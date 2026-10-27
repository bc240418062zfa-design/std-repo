import React from 'react';

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
    sm: { icon: 'w-7 h-7', textTitle: 'text-base', textSub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', textTitle: 'text-lg', textSub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', textTitle: 'text-2xl', textSub: 'text-xs' }
  };

  const currentSize = sizeMap[size];
  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Modern Academic Crest Logo */}
      <div className={`relative shrink-0 ${currentSize.icon}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`crest-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isWhite ? "#FFFFFF" : "#0A192F"} />
              <stop offset="100%" stopColor={isWhite ? "#E2E8F0" : "#060D1A"} />
            </linearGradient>
            <linearGradient id={`gold-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Shield Base */}
          <path 
            d="M50 5 L15 15 C15 15 15 75 50 95 C85 75 85 15 85 15 L50 5Z" 
            fill={`url(#crest-grad-${variant})`}
            stroke={isWhite ? "none" : "#D97706"}
            strokeWidth="2"
          />

          {/* Gold Accent Border (Inner) */}
          <path 
            d="M50 12 L22 20 C22 20 22 70 50 87 C78 70 78 20 78 20 L50 12Z" 
            stroke="#F59E0B" 
            strokeWidth="1" 
            strokeOpacity="0.4"
          />

          {/* Stylized 'M' (Academic Columns / Open Book) */}
          <path 
            d="M32 35 V65 M68 35 V65 M50 35 L32 50 L50 65 L68 50 L50 35Z" 
            stroke={isWhite ? "#0A192F" : "#FFFFFF"} 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Central Knowledge Spark */}
          <circle cx="50" cy="50" r="4" fill="#F59E0B">
            <animate 
              attributeName="opacity" 
              values="0.4;1;0.4" 
              dur="3s" 
              repeatCount="indefinite" 
            />
          </circle>

          {/* Top Star of Excellence */}
          <path 
            d="M50 20 L52 25 L57 25 L53 28 L54 33 L50 30 L46 33 L47 28 L43 25 L48 25 Z" 
            fill="#F59E0B" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center text-left leading-none">
          <span
            className={`font-serif font-black tracking-tight ${currentSize.textTitle} ${
              isWhite ? 'text-white' : 'text-slate-950'
            }`}
          >
            MIHORA
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`h-[1px] w-2.5 ${isWhite ? 'bg-amber-400/50' : 'bg-amber-600/50'}`} />
            <span
              className={`font-sans font-bold uppercase tracking-[0.2em] ${currentSize.textSub} ${
                isWhite ? 'text-blue-300' : 'text-blue-700'
              }`}
            >
              STUDY LIBRARY
            </span>
            <div className={`h-[1px] w-2.5 ${isWhite ? 'bg-amber-400/50' : 'bg-amber-600/50'}`} />
          </div>
        </div>
      )}
    </div>
  );
};
