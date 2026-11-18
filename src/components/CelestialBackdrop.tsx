import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface CelestialStarfieldProps {
  density?: number;
  className?: string;
  interactive?: boolean;
}

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  color: string;
  depth: number;
}

export const CelestialStarfield: React.FC<CelestialStarfieldProps> = ({
  density = 1,
  className = '',
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const pointer = { x: -9999, y: -9999, targetX: 0, targetY: 0, curX: 0, curY: 0 };

    const palette = [
      '255, 255, 255',
      '224, 242, 254',
      '186, 230, 253',
      '253, 230, 138'
    ];

    const initStars = () => {
      const area = width * height;
      const baseCount = Math.min(95, Math.max(30, Math.floor((area / 14000) * density)));
      stars = Array.from({ length: baseCount }, (_, idx) => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const depth = 0.25 + Math.random() * 0.75;
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          radius: Math.random() < 0.14 ? 1.5 + Math.random() * 0.8 : 0.65 + Math.random() * 0.85,
          alpha: 0.28 + Math.random() * 0.62,
          twinkleSpeed: 0.008 + Math.random() * 0.018,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.12 * depth,
          vy: (Math.random() - 0.5) * 0.09 * depth,
          color: idx % 9 === 0 ? palette[3] : palette[idx % 3],
          depth
        };
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    };

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      pointer.curX += (pointer.targetX - pointer.curX) * 0.05;
      pointer.curY += (pointer.targetY - pointer.curY) * 0.05;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!prefersReduced) {
          s.baseX += s.vx;
          s.baseY += s.vy;
          if (s.baseX < -10) s.baseX = width + 10;
          if (s.baseX > width + 10) s.baseX = -10;
          if (s.baseY < -10) s.baseY = height + 10;
          if (s.baseY > height + 10) s.baseY = -10;
        }

        const parallaxX = interactive ? pointer.curX * 14 * s.depth : 0;
        const parallaxY = interactive ? pointer.curY * 10 * s.depth : 0;
        s.x = s.baseX + parallaxX;
        s.y = s.baseY + parallaxY;

        const twinkle = prefersReduced
          ? 1
          : 0.58 + 0.42 * Math.sin(time * s.twinkleSpeed * 0.06 + s.twinklePhase);
        const alpha = Math.min(1, s.alpha * twinkle);

        // Soft starlight halo for brighter stars
        if (s.radius > 1.35) {
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 4.5);
          grad.addColorStop(0, `rgba(${s.color}, ${alpha * 0.48})`);
          grad.addColorStop(1, `rgba(${s.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Faint astronomical constellation threads near pointer
      if (interactive && !prefersReduced && pointer.x > -1000) {
        for (let i = 0; i < stars.length; i++) {
          const a = stars[i];
          const dxP = a.x - pointer.x;
          const dyP = a.y - pointer.y;
          const distP = Math.hypot(dxP, dyP);
          if (distP > 190) continue;

          for (let j = i + 1; j < stars.length; j++) {
            const b = stars[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 115) {
              const lineAlpha = (1 - dist / 115) * (1 - distP / 190) * 0.24;
              ctx.strokeStyle = `rgba(125, 211, 252, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      if (!prefersReduced) {
        animationFrameId = window.requestAnimationFrame(drawFrame);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.targetX = (pointer.x / Math.max(1, width) - 0.5) * 2;
      pointer.targetY = (pointer.y / Math.max(1, height) - 0.5) * 2;
    };

    const handlePointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }

    if (interactive && canvas.parentElement) {
      canvas.parentElement.addEventListener('pointermove', handlePointerMove, { passive: true });
      canvas.parentElement.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }

    if (prefersReduced) {
      drawFrame(0);
    } else {
      animationFrameId = window.requestAnimationFrame(drawFrame);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      if (interactive && canvas.parentElement) {
        canvas.parentElement.removeEventListener('pointermove', handlePointerMove);
        canvas.parentElement.removeEventListener('pointerleave', handlePointerLeave);
      }
    };
  }, [density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};

interface CelestialOrbitalRingsProps {
  compact?: boolean;
  className?: string;
}

export const CelestialOrbitalRings: React.FC<CelestialOrbitalRingsProps> = ({
  compact = false,
  className = ''
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 900 900"
        fill="none"
        className={`${
          compact
            ? 'w-[540px] h-[540px] -right-24 -top-24 absolute opacity-45'
            : 'w-[980px] h-[980px] sm:w-[1160px] sm:h-[1160px] opacity-40'
        }`}
      >
        <defs>
          <linearGradient id="celestial-ring-grad" x1="0" y1="0" x2="900" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.34)" />
            <stop offset="50%" stopColor="rgba(129, 140, 248, 0.14)" />
            <stop offset="100%" stopColor="rgba(251, 191, 36, 0.28)" />
          </linearGradient>
        </defs>

        {/* Outer rotating orbital ring */}
        <g className="origin-center animate-orbit-slow" style={{ transformOrigin: '450px 450px' }}>
          <circle
            cx="450"
            cy="450"
            r="410"
            stroke="url(#celestial-ring-grad)"
            strokeWidth="1"
            strokeDasharray="4 10"
          />
          <circle cx="450" cy="40" r="3.5" fill="rgba(125, 211, 252, 0.85)" />
          <circle cx="860" cy="450" r="2.5" fill="rgba(253, 230, 138, 0.8)" />
        </g>

        {/* Middle counter-rotating astrolabe arc */}
        <g className="origin-center animate-orbit-reverse" style={{ transformOrigin: '450px 450px' }}>
          <circle
            cx="450"
            cy="450"
            r="315"
            stroke="rgba(148, 163, 184, 0.14)"
            strokeWidth="1"
          />
          <path
            d="M 450 135 A 315 315 0 0 1 735 320"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M 450 765 A 315 315 0 0 1 165 580"
            stroke="rgba(251, 191, 36, 0.32)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <circle cx="735" cy="320" r="2.5" fill="rgba(56, 189, 248, 0.9)" />
        </g>

        {/* Inner hairline ring */}
        <circle
          cx="450"
          cy="450"
          r="210"
          stroke="rgba(125, 211, 252, 0.1)"
          strokeWidth="1"
          strokeDasharray="2 8"
        />
      </svg>
    </div>
  );
};

interface CelestialPageHeaderProps {
  kickerIcon?: React.ReactNode;
  kickerText: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
  badgeText?: string;
}

export const CelestialPageHeader: React.FC<CelestialPageHeaderProps> = ({
  kickerIcon,
  kickerText,
  title,
  description,
  rightSlot,
  children,
  badgeText
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden bg-studio-stage text-white rounded-3xl p-6 sm:p-9 lg:p-10 border border-slate-800/90 shadow-[0_26px_64px_-16px_rgba(4,8,20,0.68)]"
    >
      <CelestialStarfield density={0.62} />
      <CelestialOrbitalRings compact />
      <div className="absolute inset-0 bg-academic-grid opacity-30 pointer-events-none" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/65 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-indigo-500/20 blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-12 w-72 h-52 rounded-full bg-sky-500/15 blur-[90px]"
      />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-semibold uppercase tracking-wider text-sky-300">
              <span className="inline-flex items-center gap-2">
                {kickerIcon}
                <span>{kickerText}</span>
              </span>
              {badgeText && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-amber-300">{badgeText}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              {title}
            </h1>

            {description && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {rightSlot && (
            <div className="shrink-0">
              {rightSlot}
            </div>
          )}
        </div>

        {children}
      </div>
    </motion.section>
  );
};

export const CelestialDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden="true" className={`relative flex items-center justify-center py-2 ${className}`}>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
    <div className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-[#F4F7FE] border border-sky-200/80 shadow-2xs">
      <svg viewBox="0 0 24 24" className="w-3 h-3 text-blue-600" fill="currentColor">
        <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
      </svg>
    </div>
  </div>
);

