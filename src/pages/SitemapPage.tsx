import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Course } from '../types';
import { 
  Network, 
  BookOpen, 
  ShieldCheck, 
  Building2, 
  HelpCircle, 
  Search, 
  ChevronRight, 
  Layers, 
  FileText,
  Calculator,
  GraduationCap,
  ExternalLink,
  ListChecks,
  Flame,
  Files,
  Award,
  Calendar,
  FolderGit2
} from 'lucide-react';
import { ScrollReveal, StaggerGrid, StaggerItem, SpotlightCard, EASE_OUT_EXPO } from '../components/MotionPrimitives';
import { CelestialPageHeader } from '../components/CelestialBackdrop';

interface SitemapPageProps {
  courses: Course[];
  onSelectCourse: (courseCode: string) => void;
  onNavigate: (page: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ courses, onSelectCourse, onNavigate }) => {
  const [sitemapSearch, setSitemapSearch] = useState('');

  // Group courses by faculty
  const facultyGroups = useMemo(() => {
    const q = sitemapSearch.toLowerCase().trim();
    const map = new Map<string, Course[]>();
    
    courses.forEach((c) => {
      const fac = c.faculty || 'General Studies';
      const matches = !q || c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
      if (matches) {
        if (!map.has(fac)) map.set(fac, []);
        map.get(fac)!.push(c);
      }
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [courses, sitemapSearch]);

  const portalSections = [
    {
      id: 'home',
      title: 'Search Catalog & Library',
      description: 'Explore 28,328+ study documents with full-text search, filter by format, solved papers, and download.',
      icon: Search,
      iconBg: 'bg-blue-50 text-blue-600',
      hoverBorder: 'hover:border-blue-400',
      hoverText: 'group-hover:text-blue-600',
      spotlight: 'rgba(37, 99, 235, 0.12)'
    },
    {
      id: 'courses',
      title: `Course Directory (${courses.length})`,
      description: 'Full directory of 411 courses categorized by CS, Math, Management, Economics, and Mass Media.',
      icon: BookOpen,
      iconBg: 'bg-[#F3EFE6] text-[#0D1B2A]',
      hoverBorder: 'hover:border-blue-700',
      hoverText: 'group-hover:text-blue-700',
      spotlight: 'rgba(29, 78, 216, 0.08)'
    },
    {
      id: 'mcqs',
      title: 'Interactive MCQs Bank & Live Mids Practice',
      description: 'Practice 1,112+ online subject MCQs, 45s mock exams, and browse 3,256 MCQ files & 5,733 live quiz files.',
      icon: ListChecks,
      iconBg: 'bg-sky-50 text-blue-700',
      hoverBorder: 'hover:border-blue-700',
      hoverText: 'group-hover:text-blue-700',
      spotlight: 'rgba(29, 78, 216, 0.1)'
    },
    {
      id: 'subjective',
      title: 'Subjective Fast-Learning Studio (2/3/5 Marks)',
      description: '10-second memory hooks, examiner rubrics, cram sheets, and write-compare drills across 411 subject hubs.',
      icon: Flame,
      iconBg: 'bg-amber-50 text-amber-700',
      hoverBorder: 'hover:border-amber-600',
      hoverText: 'group-hover:text-amber-700',
      spotlight: 'rgba(217, 119, 6, 0.1)'
    },
    {
      id: 'past-papers',
      title: 'Solved Past Papers (Moaaz & Waqar Siddhu)',
      description: 'Access 3,877 Midterm & 7,361 Final-Term solved past paper archives plus student exam memories.',
      icon: Files,
      iconBg: 'bg-emerald-50 text-emerald-700',
      hoverBorder: 'hover:border-emerald-700',
      hoverText: 'group-hover:text-emerald-700',
      spotlight: 'rgba(16, 185, 129, 0.08)'
    },
    {
      id: 'assignment-guide',
      title: 'Assignments 2026 & Turnitin Guide',
      description: 'Solved templates, Dev-C++ boilerplate, 24-hour grace period rules, and Turnitin <19% originality checklists.',
      icon: FileText,
      iconBg: 'bg-emerald-50 text-emerald-700',
      hoverBorder: 'hover:border-emerald-700',
      hoverText: 'group-hover:text-emerald-700',
      spotlight: 'rgba(16, 185, 129, 0.08)'
    },
    {
      id: 'handbook',
      title: 'VU Student Handbook & Rules',
      description: 'Official student guide covering datesheet creation, 20% two-half rule, reschedule fee, CGPA probation, and VULMS services.',
      icon: GraduationCap,
      iconBg: 'bg-emerald-50 text-emerald-700',
      hoverBorder: 'hover:border-emerald-700',
      hoverText: 'group-hover:text-emerald-700',
      spotlight: 'rgba(16, 185, 129, 0.08)'
    },
    {
      id: 'simulator',
      title: 'Exam Passing Marks Simulator',
      description: 'Calculate required Final Term exam marks, evaluate VU 20% & 50% passing rules, and download official PDF report.',
      icon: Calculator,
      iconBg: 'bg-[#F3EFE6] text-slate-800',
      hoverBorder: 'hover:border-blue-700',
      hoverText: 'group-hover:text-blue-700',
      spotlight: 'rgba(13, 27, 42, 0.08)'
    },
    {
      id: 'gpa-calculator',
      title: 'VU GPA & CGPA Calculator (4.0)',
      description: 'Official HEC 4.0 scale semester GPA forecaster, cumulative CGPA tracker, and repeat course analyzer.',
      icon: Award,
      iconBg: 'bg-sky-50 text-sky-700',
      hoverBorder: 'hover:border-sky-700',
      hoverText: 'group-hover:text-sky-700',
      spotlight: 'rgba(2, 132, 199, 0.08)'
    },
    {
      id: 'datesheet-guide',
      title: 'Datesheet Seat Strategy Guide',
      description: 'First-come first-served lab booking checklist, preferred timeslot optimization, and reschedule rules.',
      icon: Calendar,
      iconBg: 'bg-amber-50 text-amber-700',
      hoverBorder: 'hover:border-amber-700',
      hoverText: 'group-hover:text-amber-700',
      spotlight: 'rgba(217, 119, 6, 0.08)'
    },
    {
      id: 'cs619-guide',
      title: 'CS619 FYP Capstone Roadmap',
      description: 'Milestone walkthrough for proposal, IEEE 830 SRS, ERD design, prototype build, and viva defense questions.',
      icon: FolderGit2,
      iconBg: 'bg-slate-100 text-slate-800',
      hoverBorder: 'hover:border-slate-700',
      hoverText: 'group-hover:text-slate-900',
      spotlight: 'rgba(15, 23, 42, 0.08)'
    },
    {
      id: 'security',
      title: 'Privacy & Trust Guarantee',
      description: 'Zero student data collection, safe verified documents, and ad-free high-speed downloads.',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-50 text-emerald-700',
      hoverBorder: 'hover:border-emerald-700',
      hoverText: 'group-hover:text-emerald-700',
      spotlight: 'rgba(16, 185, 129, 0.08)'
    },
    {
      id: 'about',
      title: 'About Mihora Tech & VU Mission',
      description: 'Corporate profile of MIHORA TECH and the background behind the non-commercial VU student welfare initiative.',
      icon: Building2,
      iconBg: 'bg-[#F3EFE6] text-amber-700',
      hoverBorder: 'hover:border-amber-700',
      hoverText: 'group-hover:text-amber-700',
      spotlight: 'rgba(180, 83, 9, 0.08)'
    },
    {
      id: 'disclaimer',
      title: 'Academic Disclaimer & Terms',
      description: 'Fair educational use policies, copyright disclosures, student revision guidelines, and ethical conduct.',
      icon: HelpCircle,
      iconBg: 'bg-amber-50 text-amber-700',
      hoverBorder: 'hover:border-amber-700',
      hoverText: 'group-hover:text-amber-700',
      spotlight: 'rgba(217, 119, 6, 0.08)',
      spanClass: 'sm:col-span-2 lg:col-span-1'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Celestial Observatory Header */}
      <CelestialPageHeader
        kickerIcon={<Network className="w-4 h-4" />}
        kickerText="Portal & Curriculum Directory"
        badgeText="411 Courses · 27 Faculties"
        title={
          <>
            Academic Curriculum &amp;{' '}
            <span className="text-amber-300">
              Portal Directory
            </span>
          </>
        }
        description="Quickly navigate all sections of the MIHORA STUDY LIBRARY, including the VU Student Handbook, all 411+ Virtual University courses, exam passing simulator, student trust guarantees, and academic guidelines."
      />

      {/* Main Portal Section Links */}
      <div className="space-y-4">
        <ScrollReveal direction="up">
          <h2 className="text-lg font-bold text-slate-900">Main Portal Sections</h2>
        </ScrollReveal>
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portalSections.map((section) => {
            const Icon = section.icon;
            return (
              <StaggerItem key={section.id} className={section.spanClass || ''}>
                <SpotlightCard
                  onClick={() => onNavigate(section.id)}
                  spotlightColor={section.spotlight}
                  className={`h-full p-5 rounded-2xl bg-white border border-[#E5E0D5] ${section.hoverBorder} cursor-pointer group transition-colors`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl ${section.iconBg} flex items-center justify-center font-bold transition-transform duration-200 group-hover:scale-105`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-400 ${section.hoverText} group-hover:translate-x-0.5 transition-all`} />
                    </div>
                    <h3 className={`text-sm font-bold text-slate-900 ${section.hoverText} transition-colors`}>
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {/* Machine-Readable Sitemaps & Crawler Resources */}
        <ScrollReveal direction="up" delay={0.1} className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Crawler & Indexing Protocol:</span>
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:border-blue-700 hover:text-blue-700 text-slate-700 font-mono transition-colors"
          >
            <span>XML Sitemap (Core &amp; 411 Courses)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </motion.a>
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="/sitemap-docs.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:border-blue-700 hover:text-blue-700 text-slate-700 font-mono transition-colors"
          >
            <span>Documents Sitemap (28,328 Docs)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </motion.a>
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:border-blue-700 hover:text-blue-700 text-slate-700 font-mono transition-colors"
          >
            <span>Robots.txt Policy</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </motion.a>
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:border-amber-600 hover:text-amber-700 text-slate-700 font-mono transition-colors"
          >
            <span>LLMs.txt (GEO Summary)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </motion.a>
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="/llms-full.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:border-amber-600 hover:text-amber-700 text-slate-700 font-mono transition-colors"
          >
            <span>LLMs-Full.txt (411 Courses)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </motion.a>
        </ScrollReveal>
      </div>

      {/* Comprehensive Faculty Index */}
      <div className="space-y-6">
        <ScrollReveal direction="up" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              Departmental Course Index ({courses.length} Courses)
            </h2>
            <p className="text-xs text-slate-600">
              Select any course to view its handouts, midterm & final past papers, and solved MCQs.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={sitemapSearch}
              onChange={(e) => setSitemapSearch(e.target.value)}
              placeholder="Filter courses..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#DDD6C8] focus:border-blue-700 focus:outline-none text-slate-900"
            />
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {facultyGroups.map(([faculty, facultyCourses], groupIdx) => (
            <motion.div
              key={faculty}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.35, delay: Math.min(groupIdx * 0.03, 0.18), ease: EASE_OUT_EXPO }}
              className="bg-white rounded-2xl border border-[#E5E0D5] p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  <span>{faculty}</span>
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                  {facultyCourses.length} courses
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {facultyCourses.map((c) => (
                  <motion.button
                    key={c.code}
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15, ease: EASE_OUT_EXPO }}
                    onClick={() => onSelectCourse(c.code)}
                    className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#E5E0D5] hover:border-blue-700 hover:bg-white text-left transition-colors cursor-pointer group flex flex-col justify-between"
                  >
                    <span className="font-mono text-xs font-bold text-[#0D1B2A] group-hover:text-blue-700">
                      {c.code}
                    </span>
                    <span className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 group-hover:text-slate-900">
                      {c.title}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      <span>{c.fileCount || 0} files</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
