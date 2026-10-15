import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface VUDatesheetGuidePageProps {
  onNavigateHome: () => void;
  onNavigateSimulator?: () => void;
}

export const VUDatesheetGuidePage: React.FC<VUDatesheetGuidePageProps> = ({ onNavigateHome, onNavigateSimulator }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(prev => ({ ...prev, [stepIndex]: !prev[stepIndex] }));
  };

  const STEPS = [
    {
      title: '1. Monitor Official LMS Announcement on Notice Board',
      desc: 'Datesheet notification is posted 2 to 3 weeks before exams on VULMS with exact opening date and time (usually 11:00 AM or 3:00 PM).',
      tip: 'Do not rely on unofficial WhatsApp rumors; always check the verified VULMS Notice Board.'
    },
    {
      title: '2. Login to Official Portal (datesheet.vu.edu.pk)',
      desc: 'Use your standard VULMS Student ID (e.g. BC230400000) and LMS Password. Ensure your password is not expired before the datesheet opens.',
      tip: 'If you forgot your password, reset it 24 hours prior to opening to avoid being locked out during peak server rush.'
    },
    {
      title: '3. Select Your Exam City & Preferred Physical Campus Lab',
      desc: 'Choose your home city and the specific Virtual University PVC (Private Virtual Campus) or Own Campus center where you wish to take the exam.',
      tip: 'Once seats in your preferred center fill up, you will be forced to choose a distant campus.'
    },
    {
      title: '4. Choose Exam Dates & Time Slots (First-Come, First-Served)',
      desc: 'Spread your papers with at least 1 to 2 preparation days between challenging courses (e.g. MTH101, CS301, CS201).',
      tip: 'Morning slots (8:30 AM & 10:30 AM) generally have optimal computer lab responsiveness and internet stability.'
    },
    {
      title: '5. Confirm & Generate Official Exam Entrance Slip',
      desc: 'Review all dates, times, and course codes carefully. Once finalized, click Confirm and download the official PDF Examination Slip.',
      tip: 'Print at least two physical hard copies immediately and store one as a backup.'
    }
  ];

  const TIME_SLOTS = [
    { session: 'Session 1', time: '08:30 AM – 10:00 AM', status: 'Highly Recommended', notes: 'Optimal computer lab performance, zero lag, cooler temperatures.' },
    { session: 'Session 2', time: '10:30 AM – 12:00 PM', status: 'Popular Choice', notes: 'Convenient commute, high demand slot, fills within 15 minutes.' },
    { session: 'Session 3', time: '12:30 PM – 02:00 PM', status: 'Moderate', notes: 'Midday slot; check for Friday prayer timing adjustments.' },
    { session: 'Session 4', time: '02:30 PM – 04:00 PM', status: 'Popular Choice', notes: 'Good afternoon timing, stable lab connectivity.' },
    { session: 'Session 5', time: '04:30 PM – 06:00 PM', status: 'Evening Slot', notes: 'Higher chance of ambient fatigue, check return commute.' },
    { session: 'Session 6', time: '06:30 PM – 08:00 PM', status: 'Emergency Slot', notes: 'Usually opened only when earlier sessions reach maximum capacity.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-blue-600 transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">VU Datesheet Guide &amp; Seat Strategy</span>
      </nav>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>OFFICIAL EXAMINATION PROTOCOL • 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            VU Datesheet Maker &amp; Seat Booking Master Guide
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Everything you need to know about Virtual University datesheet opening, first-come first-served lab seat allocation, preferred timeslot selection, and missed paper rescheduling procedures.
          </p>
        </div>
      </div>

      {/* Critical First-Hour Alert */}
      <div className="bg-amber-50/80 rounded-2xl border border-amber-200/90 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-amber-950">
              The Golden Rule: Make Your Datesheet Within the First 60–120 Minutes
            </h3>
            <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed max-w-3xl">
              Virtual University allocates exam computer terminals strictly on a <strong>first-come, first-served</strong> basis. If you delay making your datesheet, local campus slots fill up, and you may be forced to travel to other cities or accept awkward 6:30 PM evening slots.
            </p>
          </div>
        </div>
        <a
          href="https://datesheet.vu.edu.pk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
        >
          <span>Official Datesheet Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Step-by-Step Interactive Checklist */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            Step-by-Step Datesheet Booking Walkthrough
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Check off each milestone to ensure you avoid late fees and missed exams.
          </p>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, idx) => {
            const isDone = !!completedSteps[idx];
            return (
              <div 
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  isDone 
                    ? 'bg-blue-50/50 border-blue-200' 
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                    isDone 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-slate-300 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-base font-bold transition-colors ${isDone ? 'text-blue-900 line-through' : 'text-slate-900'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                    <div className="inline-block mt-1 text-[11px] font-medium text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                      <strong>Pro-Tip:</strong> {step.tip}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Time Slot Analysis Table */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-600" />
            VU Exam Daily Time Slots Analysis
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Each exam session runs for 60 minutes (Midterm) or 90 minutes (Finalterm). Choose your timing wisely.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-3 px-4">Session</th>
                <th className="py-3 px-4">Exam Time Slot</th>
                <th className="py-3 px-4">Recommendation</th>
                <th className="py-3 px-4">Operational Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TIME_SLOTS.map((slot, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">{slot.session}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{slot.time}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      slot.status === 'Highly Recommended' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : slot.status === 'Popular Choice'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {slot.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{slot.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Missed Exam & Rescheduling Policy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Official Rescheduling Procedure
          </div>
          <h3 className="text-xl font-bold">What if you miss an exam paper?</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If you miss an examination due to illness, travel, or unavoidable emergencies, Virtual University allows you to apply for a <strong>Rescheduled Paper</strong> through VULMS Student Services within 24–48 hours of the scheduled exam date.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
            <li>Fee: <strong>PKR 2,000</strong> per paper (added to your fee voucher).</li>
            <li>All rescheduled papers take place on the single announced makeup day at the end of the exam schedule.</li>
            <li>You must reprint an updated examination slip for the makeup date.</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Exam Day Essential Checklist
          </div>
          <h3 className="text-xl font-bold text-slate-900">What to Bring to the Exam Center</h3>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Printed Exam Entrance Slip:</strong> Clean hardcopy with visible barcode and photo.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Original Identity Card:</strong> Original CNIC, Passport, or VU Student ID card.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Approved Calculator:</strong> Non-programmable scientific calculator (e.g. Casio fx-82/991).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Arrival Time:</strong> Arrive at least 20 minutes before your session start.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
