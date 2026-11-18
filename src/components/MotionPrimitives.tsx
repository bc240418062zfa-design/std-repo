import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useInView,
  animate,
  AnimatePresence,
  HTMLMotionProps
} from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.45,
  distance = 22,
  className = ''
}) => {
  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'scale':
        return { opacity: 0, scale: 0.94, y: 12 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export const StaggerGrid: React.FC<StaggerGridProps> = ({
  children,
  className = '',
  stagger = 0.055
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 'some' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: 0.03
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.38, ease: EASE_OUT_EXPO }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  onClick?: () => void;
  hoverLift?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(37, 99, 235, 0.10)',
  onClick,
  hoverLift = -5
}) => {
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    mouseX.set(-300);
    mouseY.set(-300);
  };

  const background = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 75%)`;

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      whileHover={{ y: hoverLift }}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ background }}
        aria-hidden="true"
      />
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  magnetic?: boolean;
  shimmer?: boolean;
  className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  magnetic = false,
  shimmer = true,
  className = '',
  onPointerMove,
  onPointerLeave,
  ...props
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 24 });
  const springY = useSpring(y, { stiffness: 320, damping: 24 });

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (magnetic) {
      const rect = e.currentTarget.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.16;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.16;
      x.set(Math.max(-6, Math.min(6, dx)));
      y.set(Math.max(-5, Math.min(5, dy)));
    }
    onPointerMove?.(e);
  };

  const handleLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (magnetic) {
      x.set(0);
      y.set(0);
    }
    onPointerLeave?.(e);
  };

  return (
    <motion.button
      style={magnetic ? { x: springX, y: springY } : undefined}
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`${shimmer ? 'btn-shimmer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.15,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 'some' });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

interface ParallaxLayerProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  offset = 30,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

interface MarqueeItem {
  code: string;
  label: string;
  hint: string;
}

interface CourseMarqueeProps {
  items: MarqueeItem[];
  onSelectCourse: (code: string) => void;
}

export const CourseMarquee: React.FC<CourseMarqueeProps> = ({ items, onSelectCourse }) => {
  const doubled = [...items, ...items];

  return (
    <div className="marquee-wrapper relative overflow-hidden py-3 border-y border-slate-200/80 bg-white/80 backdrop-blur-xs select-none">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#F5F7FC] to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#F5F7FC] to-transparent z-10"
        aria-hidden="true"
      />

      <div className="animate-marquee flex items-center gap-3">
        {doubled.map((item, idx) => (
          <motion.button
            key={`${item.code}-${idx}`}
            type="button"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectCourse(item.code)}
            className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/90 hover:border-blue-300 text-xs transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <span className="font-mono font-bold text-blue-700">{item.code}</span>
            <span className="text-slate-700 font-medium whitespace-nowrap">{item.label}</span>
            <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">· {item.hint}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

interface FloatingScrollTopProps {
  liftForBar?: boolean;
}

export const FloatingScrollTop: React.FC<FloatingScrollTopProps> = ({ liftForBar = false }) => {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setVisible(latest > 360);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(smoothProgress, [0, 1], [circumference, 0]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.75, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: liftForBar ? -74 : 0 }}
          exit={{ opacity: 0, scale: 0.75, y: 16 }}
          whileHover={{ scale: 1.08, y: liftForBar ? -77 : -3 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 360, damping: 25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
          title="Back to top"
          className="fixed bottom-5 right-5 z-30 w-12 h-12 rounded-full bg-slate-950/90 hover:bg-blue-700 text-white shadow-xl border border-slate-700/80 backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="absolute inset-0 -rotate-90 pointer-events-none"
            aria-hidden="true"
          >
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="rgba(148,163,184,0.22)"
              strokeWidth="2.5"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
            />
          </svg>
          <ArrowUp className="w-4 h-4 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
