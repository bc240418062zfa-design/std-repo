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
  ExternalLink
} from 'lucide-react';
import { ScrollReveal, StaggerGrid, StaggerItem, SpotlightCard, EASE_OUT_EXPO } from '../components/MotionPrimitives';

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
      iconBg: 'bg-indigo-50 text-indigo-600',
      hoverBorder: 'hover:border-indigo-400',
      hoverText: 'group-hover:text-indigo-600',
      spotlight: 'rgba(79, 70, 229, 0.12)'
    },
    {
      id: 'handbook',
      title: 'VU Student Handbook & Rules',
      description: 'Official student guide covering datesheet creation, 20% two-half rule, reschedule fee, CGPA probation, and VULMS services.',
      icon: GraduationCap,
      iconBg: 'bg-emerald-50 text-emerald-600',
      hoverBorder: 'hover:border-emerald-400',
      hoverText: 'group-hover:text-emerald-600',
      spotlight: 'rgba(16, 185, 129, 0.12)'
    },
    {
      id: 'simulator',
      title: 'Exam Passing Marks Simulator',
      description: 'Calculate required Final Term exam marks, evaluate VU 20% & 50% passing rules, and download official PDF report.',
      icon: Calculator,
      iconBg: 'bg-slate-100 text-slate-700',
      hoverBorder: 'hover:border-slate-400',
      hoverText: 'group-hover:text-blue-600',
      spotlight: 'rgba(71, 85, 105, 0.10)'
    },
    {
      id: 'security',
      title: 'Privacy & Trust Guarantee',
      description: 'Zero student data collection, safe verified documents, and ad-free high-speed downloads.',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-50 text-emerald-600',
      hoverBorder: 'hover:border-emerald-400',
      hoverText: 'group-hover:text-emerald-600',
      spotlight: 'rgba(16, 185, 129, 0.12)'
    },
    {
      id: 'about',
      title: 'About Mihora Tech & VU Mission',
      description: 'Corporate profile of MIHORA TECH and the background behind the non-commercial VU student welfare initiative.',
      icon: Building2,
      iconBg: 'bg-purple-50 text-purple-600',
      hoverBorder: 'hover:border-purple-400',
      hoverText: 'group-hover:text-purple-600',
      spotlight: 'rgba(147, 51, 234, 0.12)'
    },
    {
      id: 'disclaimer',
      title: 'Academic Disclaimer & Terms',
      description: 'Fair educational use policies, copyright disclosures, student revision guidelines, and ethical conduct.',
      icon: HelpCircle,
      iconBg: 'bg-amber-50 text-amber-600',
      hoverBorder: 'hover:border-amber-400',
      hoverText: 'group-hover:text-amber-600',
      spotlight: 'rgba(217, 119, 6, 0.12)',
      spanClass: 'sm:col-span-2 lg:col-span-1'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <ScrollReveal direction="up" className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-blue-700 text-xs font-extrabold tracking-widest uppercase">
          <Network className="w-4 h-4" />
          <span>Portal & Curriculum Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Academic Curriculum & Portal Directory
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Quickly navigate all sections of the MIHORA STUDY LIBRARY, including the VU Student Handbook, all 411+ Virtual University courses, exam passing simulator, student trust guarantees, and academic guidelines.
        </p>
      </ScrollReveal>

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
                  className={`h-full p-5 rounded-2xl bg-white border border-slate-200 ${section.hoverBorder} card-elevated cursor-pointer group`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl ${section.iconBg} flex items-center justify-center font-bold transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-400 ${section.hoverText} group-hover:translate-x-0.5 transition-all`} />
                    </div>
                    <h3 className={`text-sm font-bold text-slate-900 ${section.hoverText} transition-colors`}>
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-slate-700 font-mono transition-colors shadow-2xs"
          >
            <span>XML Sitemap (RFC-compliant)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </motion.a>
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-slate-700 font-mono transition-colors shadow-2xs"
          >
            <span>Robots.txt Policy</span>
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
            <p className="text-xs text-slate-500">
              Select any course to view its handouts, midterm & final past papers, and solved MCQs.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={sitemapSearch}
              onChange={(e) => setSitemapSearch(e.target.value)}
              placeholder="Filter courses..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-shadow"
            />
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {facultyGroups.map(([faculty, facultyCourses], groupIdx) => (
            <motion.div
              key={faculty}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.4, delay: Math.min(groupIdx * 0.04, 0.2), ease: EASE_OUT_EXPO }}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>{faculty}</span>
                </h3>
                <span className="text-xs font-semibold text-slate-600 tabular-nums">
                  {facultyCourses.length} courses
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {facultyCourses.map((c) => (
                  <motion.button
                    key={c.code}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.16, ease: EASE_OUT_EXPO }}
                    onClick={() => onSelectCourse(c.code)}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-xs text-left transition-colors cursor-pointer group flex flex-col justify-between"
                  >
                    <span className="font-mono text-xs font-bold text-blue-700 group-hover:text-blue-800">
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
