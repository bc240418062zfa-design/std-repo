import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  EyeOff,
  FileCheck2,
  HeartHandshake,
  Server
} from 'lucide-react';
import {
  ScrollReveal,
  SpotlightCard,
  AnimatedButton,
  EASE_OUT_EXPO
} from '../components/MotionPrimitives';
import {
  CelestialPageHeader,
  CelestialStarfield,
  CelestialOrbitalRings
} from '../components/CelestialBackdrop';

export const SecurityPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const pillars = [
    {
      icon: <EyeOff className="w-5 h-5" />,
      iconColor: 'text-blue-700',
      glow: 'rgba(37, 99, 235, 0.08)',
      title: 'Zero Personal Data Collection',
      desc: 'We never require student account registration, LMS credentials, university roll numbers, or personal contact info. You can freely search, browse, practice MCQs, and download study files without tracking cookies or personal profile tracking.'
    },
    {
      icon: <FileCheck2 className="w-5 h-5" />,
      iconColor: 'text-emerald-700',
      glow: 'rgba(16, 185, 129, 0.08)',
      title: 'Verified & Clean Study Files',
      desc: 'All 28,328 academic documents (handouts, solved past papers, MCQs, presentation slides) are verified educational files (PDF, DOCX, PPTX). No malicious executables, spam installers, or corrupted archives are ever served.'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      iconColor: 'text-amber-700',
      glow: 'rgba(217, 119, 6, 0.08)',
      title: '100% Ad-Free & Direct Access',
      desc: 'Unlike informal blogs or ad-heavy download sites, MIHORA STUDY has zero popup ads, zero countdown timers, and zero monetization link shorteners. Every document opens or downloads directly with a single click.'
    },
    {
      icon: <Server className="w-5 h-5" />,
      iconColor: 'text-indigo-700',
      glow: 'rgba(99, 102, 241, 0.08)',
      title: 'High-Availability Cloud CDN',
      desc: 'During high-stress midterm and final examination seasons, our distributed edge infrastructure ensures the portal stays online 24/7 with fast load times across PTCL, Nayatel, StormFiber, Jazz, Zong, and overseas connections.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-9">
      {/* Celestial Observatory Header */}
      <CelestialPageHeader
        kickerIcon={<ShieldCheck className="w-4 h-4" />}
        kickerText="Student Trust & Safety Guarantee"
        badgeText="Zero Tracking · Verified Clean Files"
        title={
          <>
            Privacy, Security &amp;{' '}
            <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-amber-200 bg-clip-text text-transparent">
              Resource Safety
            </span>
          </>
        }
        description="MIHORA STUDY LIBRARY is built with a student-first philosophy. We prioritize absolute user privacy, verified document safety, and zero commercial interruptions for every Virtual University student across Pakistan."
      />

      {/* Trust Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.36, delay: idx * 0.06, ease: EASE_OUT_EXPO }}
          >
            <SpotlightCard
              spotlightColor={item.glow}
              className="group h-full card-celestial rounded-2xl border p-6 sm:p-7"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3 ${item.iconColor}`}>
                  {item.icon}
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">{item.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Educational Commitments List */}
      <ScrollReveal direction="up" distance={20} className="celestial-top-glint card-celestial rounded-3xl border p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-sans">
          <HeartHandshake className="w-5 h-5 text-blue-700" />
          <span>Our Operational Commitments to Students</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
          {[
            {
              title: 'Permanent Free Access:',
              body: 'All study materials and interactive MCQs remain 100% free with no paywalls or subscription fees.'
            },
            {
              title: 'Link Integrity Checks:',
              body: 'Links are continuously maintained to prevent broken downloads before and during exams.'
            },
            {
              title: 'Fast Mobile Performance:',
              body: 'Lightweight interface engineered to run smoothly on smartphones and low-bandwidth connections.'
            },
            {
              title: 'Independent Academic CSR:',
              body: 'Supported by MIHORA TECH as a corporate social responsibility initiative for Pakistan.'
            }
          ].map((c, idx) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ delay: idx * 0.05, ease: EASE_OUT_EXPO }}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-white/85 border border-slate-200/70"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div>
                <strong className="text-slate-900">{c.title}</strong> {c.body}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Return to Library CTA */}
      <ScrollReveal
        direction="up"
        distance={20}
        className="relative overflow-hidden p-6 sm:p-9 rounded-3xl bg-studio-stage text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-800 shadow-[0_24px_60px_-15px_rgba(4,8,20,0.65)]"
      >
        <CelestialStarfield density={0.45} interactive={false} />
        <CelestialOrbitalRings compact />
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/55 to-transparent" aria-hidden="true" />
        <div className="relative z-10 space-y-1">
          <h2 className="text-xl font-bold text-white font-sans">Ready to start studying?</h2>
          <p className="text-sm text-slate-300">
            Search 28,328+ course handouts, midterm papers, final papers, and solved MCQs.
          </p>
        </div>
        <AnimatedButton
          magnetic
          shimmer
          type="button"
          onClick={onNavigateHome}
          className="relative z-10 group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all cursor-pointer shrink-0 shadow-lg"
        >
          <span>Explore Library</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </AnimatedButton>
      </ScrollReveal>
    </div>
  );
};
