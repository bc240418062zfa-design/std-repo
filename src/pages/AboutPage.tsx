import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  HeartHandshake, 
  ShieldCheck, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { MihoraLogo } from '../components/MihoraLogo';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateCourses: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome, onNavigateCourses }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Hero / Corporate Identity Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Building2 className="w-4 h-4" />
          <span>ABOUT MIHORA TECH & VU INITIATIVE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Empowering Virtual University Students Across Pakistan
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          MIHORA STUDY LIBRARY (<a href="https://study.mihora.tech" className="text-blue-600 font-semibold underline underline-offset-2">study.mihora.tech</a>) is a dedicated non-commercial academic social initiative engineered by <a href="https://www.mihora.tech" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold hover:text-blue-600 transition-colors inline-flex items-center gap-1">MIHORA TECH <ExternalLink className="w-3.5 h-3.5" /></a> to solve the critical challenges of educational resource discovery for distance-learning university students.
        </p>
      </div>

      {/* Corporate Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <MihoraLogo variant="dark" size="lg" />
            <p className="text-xs text-slate-500 font-medium">
              Enterprise Software & Academic Technology Innovations
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.mihora.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              <span>Visit www.mihora.tech</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold">
              Official Corporate CSR Program
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>About MIHORA TECH</span>
            </h2>
            <p>
              MIHORA TECH is a modern software engineering and cloud systems lab committed to building reliable, high-performance web applications and digital infrastructure. Our core operations span web platforms, cryptographic data protocols, and educational tools designed to streamline access to information.
            </p>
            <p>
              As part of our commitment to social technological impact, we maintain independent educational portals that remove friction from digital education in developing regions, prioritizing speed, clean UI, and absolute data privacy.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Why We Created This Initiative</span>
            </h2>
            <p>
              The <strong>Virtual University of Pakistan (VU)</strong> is Pakistan’s premier government distance-learning institution, serving tens of thousands of undergraduate and postgraduate students nationwide across urban and remote regions.
            </p>
            <p>
              While distance education allows unprecedented geographical flexibility, students frequently face severe roadblocks: scattered study materials, broken Google Drive links in informal social groups, ad-heavy spam websites, and expired download links during high-stress exam periods.
            </p>
          </div>
        </div>
      </div>

      {/* The Helping Approach for VU Students */}
      <div className="space-y-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Dedicated Helping Approach</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            How MIHORA STUDY Helps VU Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Engineered with student feedback to eliminate clutter and provide immediate academic support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">411+ Unified Courses</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every course code (e.g. CS101, CS201, CS504, MTH101, MTH302, MGT211, ENG101) is indexed systematically across Computer Science, Business, Mathematics, and Humanities faculties.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">28,328+ Authentic Documents</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Contains verified handouts, midterm solved past papers (Moaaz & Waqar Siddhu collections), final term papers, short notes, solved objective MCQs, and presentation slides.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero Ads & Zero Login</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No popups, no ad banners, no subscription fees, and no mandatory login or registration. Students can immediately access and download documents within seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Key Guarantees & Code of Conduct */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>Our Integrity & Operational Commitments</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">100% Free Forever:</strong> We will never introduce paywalls, download throttling, or premium subscription tiers for educational materials.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">No Student Telemetry:</strong> We do not collect student roll numbers, phone numbers, email addresses, or personal identity information.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Virus & Malware Scanned:</strong> All repository items are validated against spam, broken links, and executable files to ensure safe downloads.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">High-Speed Static Delivery:</strong> Hosted on global edge CDN nodes guaranteeing sub-100ms load times across all Pakistani ISPs.
            </div>
          </div>
        </div>
      </div>

      {/* Official Academic Disclaimer */}
      <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2 text-xs">
        <div className="font-bold flex items-center gap-2 text-amber-900 text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>IMPORTANT EDUCATIONAL NOTICE & DISCLAIMER</span>
        </div>
        <p className="leading-relaxed">
          MIHORA STUDY LIBRARY is an <strong>independent student community initiative</strong> built and maintained by MIHORA TECH. This portal is not officially sponsored, endorsed, or affiliated with the Virtual University of Pakistan. All course outlines, video lecture references, and syllabus contents remain the intellectual property of their respective educators, course directors, and the Virtual University of Pakistan. All past paper solutions and study notes were prepared by dedicated student contributors (including prominent VU community alumni such as Moaaz, Waqar Siddhu, and others) for academic revision and peer assistance purposes under fair educational use principles.
        </p>
      </div>

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          Have suggestions or study resources to contribute? Contact our engineering team at <a href="https://www.mihora.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">www.mihora.tech</a>.
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateCourses}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            Browse All 411 Courses
          </button>
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Search Study Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
