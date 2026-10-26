import React from 'react';
import { FilterState, Course } from '../types';
import { Filter, RotateCcw, Check, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  courses: Course[];
  limit: number;
  onLimitChange: (limit: number) => void;
  totalFiltered: number;
  totalMatching: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  courses,
  limit,
  onLimitChange,
  totalFiltered,
  totalMatching
}) => {
  const resourceTypes = [
    { label: 'All Types', value: '' },
    { label: 'Midterms (3,877)', value: 'MIDTERM' },
    { label: 'Finalterm (7,361)', value: 'FINALTERM' },
    { label: 'Quizzes (5,733)', value: 'QUIZ' },
    { label: 'MCQ Files (3,256)', value: 'MCQFILE' },
    { label: 'Handouts & Books (2,625)', value: 'HANDOUT' },
    { label: 'Assignments & GDBs (419)', value: 'ASSIGNMENT' },
    { label: 'Other Course Files (5,057)', value: 'OTHER' }
  ];

  const formats = [
    { label: 'All Formats', value: '' },
    { label: 'PDF Documents (22,865)', value: 'PDF' },
    { label: 'Images / Screenshots (3,069)', value: 'IMAGE' },
    { label: 'Word DOC/DOCX (1,540)', value: 'DOC' },
    { label: 'PowerPoint PPT (529)', value: 'PPT' },
    { label: 'ZIP Archives (185)', value: 'ARCHIVE' },
    { label: 'Other Formats (123)', value: 'OTHER' },
    { label: 'Text Notes (17)', value: 'TXT' }
  ];

  const isMcqActive = filters.tags.includes('MCQ');

  const handleToggleMcq = () => {
    if (isMcqActive) {
      onFilterChange({
        ...filters,
        tags: filters.tags.filter((t) => t !== 'MCQ')
      });
    } else {
      onFilterChange({
        ...filters,
        tags: [...filters.tags, 'MCQ']
      });
    }
  };

  const activeFilterCount =
    (filters.course ? 1 : 0) +
    (filters.type ? 1 : 0) +
    (filters.format ? 1 : 0) +
    (filters.solvedOnly ? 1 : 0) +
    (filters.pastPapersOnly ? 1 : 0) +
    (filters.currentOnly ? 1 : 0) +
    filters.tags.length;

  const handleReset = () => {
    onFilterChange({
      course: '',
      type: '',
      format: '',
      tags: [],
      solvedOnly: false,
      pastPapersOnly: false,
      currentOnly: false
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8 sticky top-16 z-20 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-0.5 select-none">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
          </div>

          {/* Course Selector */}
          <div className="relative">
            <select
              value={filters.course}
              onChange={(e) => onFilterChange({ ...filters, course: e.target.value })}
              className="appearance-none bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200/90 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors cursor-pointer"
              aria-label="Filter by course"
            >
              <option value="">All Courses ({courses.length})</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Type Selector */}
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
              className="appearance-none bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200/90 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors cursor-pointer"
              aria-label="Filter by type"
            >
              {resourceTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Format Selector */}
          <div className="relative">
            <select
              value={filters.format}
              onChange={(e) => onFilterChange({ ...filters, format: e.target.value })}
              className="appearance-none bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200/90 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors cursor-pointer"
              aria-label="Filter by format"
            >
              {formats.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" aria-hidden="true" />

          {/* Fast Toggle Buttons for Solved & Past Papers */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, solvedOnly: !filters.solvedOnly })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer border ${
              filters.solvedOnly
                ? 'bg-[#0A192F] border-[#0A192F] text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {filters.solvedOnly && <Check className="w-3 h-3 text-amber-400" />}
            <span>Solved Only</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, pastPapersOnly: !filters.pastPapersOnly })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer border ${
              filters.pastPapersOnly
                ? 'bg-[#0A192F] border-[#0A192F] text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {filters.pastPapersOnly && <Check className="w-3 h-3 text-amber-400" />}
            <span>Past Papers</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMcq}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 cursor-pointer border ${
              isMcqActive
                ? 'bg-[#0A192F] border-[#0A192F] text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {isMcqActive && <Check className="w-3 h-3 text-amber-400" />}
            <span>MCQs</span>
          </button>

          {/* Reset Filters if active */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Results per page / limit */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 shrink-0">
          <span className="text-slate-600 font-medium">
            <strong className="text-slate-900 font-mono font-bold tabular-nums">{totalFiltered}</strong> of <strong className="text-slate-900 font-mono font-bold tabular-nums">{totalMatching.toLocaleString()}</strong> files
          </span>
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <span className="px-1.5 text-[11px] text-slate-400 font-medium select-none">Limit:</span>
            {[12, 24, 48, 96].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLimitChange(l)}
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer font-mono ${
                  limit === l
                    ? 'bg-[#0A192F] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
