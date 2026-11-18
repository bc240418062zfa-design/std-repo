import React from 'react';
import { motion } from 'motion/react';
import {
  HelpCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ScrollReveal, AnimatedButton, EASE_OUT_EXPO } from '../components/MotionPrimitives';

interface DisclaimerPageProps {
  onNavigateHome: () => void;
  onNavigateCourses: () => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigateHome, onNavigateCourses }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <ScrollReveal direction="up" distance={18} className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-700">
          <HelpCircle className="w-4 h-4" />
          <span>Legal &amp; Academic Policies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Academic Notice &amp; Disclaimer
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Please review the operational principles, intellectual property attribution, and fair educational use terms governing the MIHORA STUDY LIBRARY.
        </p>
      </ScrollReveal>

      {/* Main Notice Card */}
      <ScrollReveal
        direction="scale"
        className="p-6 sm:p-8 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-4 card-elevated"
      >
        <div className="flex items-center gap-2.5 font-bold text-amber-900 text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Independent Student Welfare Approach</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90">
          <strong>MIHORA STUDY LIBRARY (<a href="https://study.mihora.tech" className="underline font-semibold">study.mihora.tech</a>)</strong> is an independent digital educational portal engineered by <strong>MIHORA TECH</strong>. This portal is <strong>not</strong> officially associated with, sponsored by, or an official product of the Virtual University of Pakistan (VU).
        </p>
      </ScrollReveal>

      {/* Detailed Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {[
          {
            title: '1. Intellectual Property & Copyright Ownership',
            paragraphs: [
              'All course syllabus outlines, video lecture transcript references, official handouts, and institutional exam formats are and remain the exclusive intellectual property of their respective educators, course directors, and the Virtual University of Pakistan.',
              'Study notes, solved past papers, and objective question compilations curated within this library were authored by student community contributors (including distinguished alumni contributors such as Moaaz, Waqar Siddhu, and other senior student peers) who originally distributed them publicly for peer assistance.'
            ]
          },
          {
            title: '2. Fair Educational Use Doctrine',
            paragraphs: [
              'This portal is provided strictly for non-commercial, non-profit academic assistance. It operates under fair educational use principles to assist remote, working, and distance-learning students in Pakistan in accessing necessary study materials without financial, technical, or geographical barriers.',
              'No user fees, subscriptions, or paywalls are charged. MIHORA TECH does not sell, license, or monetize any academic documents housed in this directory.'
            ]
          },
          {
            title: '3. Accuracy & Verification Disclaimer',
            paragraphs: [
              'While MIHORA TECH utilizes automated verification scripts to ensure link integrity and eliminate malware or spam, students are advised to cross-reference past paper solutions with their official handouts and video lectures. Solution keys compiled by student peers may contain occasional typographical or human errors.'
            ]
          },
          {
            title: '4. Takedown & Copyright Notice Procedure',
            paragraphs: [
              'If you are an educator, author, or copyright holder and believe any specific document should be removed or updated, please contact our administrative team via www.mihora.tech. We honor valid academic takedown requests expeditiously.'
            ]
          }
        ].map((sec, idx) => (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.34, delay: idx * 0.05, ease: EASE_OUT_EXPO }}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-2.5 card-elevated"
          >
            <h2 className="text-base sm:text-lg font-bold text-slate-900">{sec.title}</h2>
            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx}>{p}</p>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Action Footer */}
      <ScrollReveal direction="up" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onNavigateCourses}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
        >
          Browse All Courses
        </motion.button>
        <AnimatedButton
          magnetic
          shimmer
          type="button"
          onClick={onNavigateHome}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
        >
          <span>Return to Library</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </AnimatedButton>
      </ScrollReveal>
    </div>
  );
};
