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
    <div className="surface-frosted border border-slate-200/80 rounded-2xl py-3 px-4 sm:px-5 sticky top-16 z-20 card-elevated">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-0.5 select-none">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filter</span>
          </div>

          {/* Course Selector */}
          <div className="relative">
            <select
              value={filters.course}
              onChange={(e) => onFilterChange({ ...filters, course: e.target.value })}
              className="h-9 appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors cursor-pointer max-w-[200px] truncate"
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
              className="h-9 appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors cursor-pointer"
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
              className="h-9 appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors cursor-pointer"
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

          <div className="h-4 w-px bg-slate-200 mx-0.5 hidden sm:block" aria-hidden="true" />

          {/* Fast Toggle Buttons */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, solvedOnly: !filters.solvedOnly })}
            className={`h-9 inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-xl transition-colors cursor-pointer border whitespace-nowrap ${
              filters.solvedOnly
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {filters.solvedOnly && <Check className="w-3.5 h-3.5" />}
            <span>Solved Only</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, pastPapersOnly: !filters.pastPapersOnly })}
            className={`h-9 inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-xl transition-colors cursor-pointer border whitespace-nowrap ${
              filters.pastPapersOnly
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {filters.pastPapersOnly && <Check className="w-3.5 h-3.5" />}
            <span>Past Papers</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMcq}
            className={`h-9 inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-xl transition-colors cursor-pointer border whitespace-nowrap ${
              isMcqActive
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {isMcqActive && <Check className="w-3.5 h-3.5" />}
            <span>MCQ Files</span>
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="h-9 inline-flex items-center gap-1 px-3 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200 whitespace-nowrap"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Results per page / limit */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 shrink-0">
          <span className="text-slate-600 font-medium tabular-nums">
            <strong className="text-slate-900 font-mono font-bold">{totalFiltered}</strong> of{' '}
            <strong className="text-slate-900 font-mono font-bold">{totalMatching.toLocaleString()}</strong> files
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            {[12, 24, 48, 96].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLimitChange(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer font-mono tabular-nums ${
                  limit === l
                    ? 'bg-white text-slate-950 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-950'
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
