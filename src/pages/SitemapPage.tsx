import React, { useState, useMemo } from 'react';
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
  FileText
} from 'lucide-react';

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Network className="w-4 h-4" />
          <span>PORTAL & CURRICULUM DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Academic Curriculum & Portal Directory
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Quickly navigate all sections of the MIHORA STUDY LIBRARY, including all 411+ Virtual University courses, student trust guarantees, academic guidelines, and search routes.
        </p>
      </div>

      {/* Main Portal Section Links */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Main Portal Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('home')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Search className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Search Catalog & Library
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore 28,328+ study documents with full-text search, filter by format, solved papers, and download.
            </p>
          </div>

          <div
            onClick={() => onNavigate('courses')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Course Directory ({courses.length})
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full directory of 411 courses categorized by CS, Math, Management, Economics, and Mass Media.
            </p>
          </div>

          <div
            onClick={() => onNavigate('security')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Privacy & Trust Guarantee
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zero student data collection, safe verified documents, and ad-free high-speed downloads.
            </p>
          </div>

          <div
            onClick={() => onNavigate('about')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              About Mihora Tech & VU Mission
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Corporate profile of MIHORA TECH and the background behind the non-commercial VU student welfare initiative.
            </p>
          </div>

          <div
            onClick={() => onNavigate('disclaimer')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <HelpCircle className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Academic Disclaimer & Terms
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fair educational use policies, copyright disclosures, student revision guidelines, and ethical conduct.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Faculty Index */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="space-y-6">
          {facultyGroups.map(([faculty, facultyCourses]) => (
            <div key={faculty} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>{faculty}</span>
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {facultyCourses.length} courses
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {facultyCourses.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => onSelectCourse(c.code)}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all cursor-pointer group flex flex-col justify-between"
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
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
