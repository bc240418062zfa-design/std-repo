import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterState, Course } from '../types';
import { Filter, RotateCcw, Check, ChevronDown } from 'lucide-react';
import { EASE_OUT_EXPO } from './MotionPrimitives';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  courses: Course[];
  limit: number;
  onLimitChange: (limit: number) => void;
  totalFiltered: number;
  totalMatching: number;
  // Unique-file counts per type/format (after collapsing repeat listings).
  // When provided, dropdown labels show these truthful counts instead of
  // the old hardcoded archive totals.
  typeCounts?: Record<string, number>;
  formatCounts?: Record<string, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  courses,
  limit,
  onLimitChange,
  totalFiltered,
  totalMatching,
  typeCounts,
  formatCounts
}) => {
  const fmt = (n: number) => n.toLocaleString();
  const resourceTypes = [
    { label: 'All Types', value: '' },
    { label: `Midterms (${fmt(typeCounts?.MIDTERM ?? 3877)})`, value: 'MIDTERM' },
    { label: `Finalterm (${fmt(typeCounts?.FINALTERM ?? 7361)})`, value: 'FINALTERM' },
    { label: `Quizzes (${fmt(typeCounts?.QUIZ ?? 5733)})`, value: 'QUIZ' },
    { label: `MCQ Files (${fmt(typeCounts?.MCQFILE ?? 3256)})`, value: 'MCQFILE' },
    { label: `Handouts & Books (${fmt(typeCounts?.HANDOUT ?? 2625)})`, value: 'HANDOUT' },
    { label: `Assignments & GDBs (${fmt(typeCounts?.ASSIGNMENT ?? 419)})`, value: 'ASSIGNMENT' },
    { label: `Other Course Files (${fmt(typeCounts?.OTHER ?? 5057)})`, value: 'OTHER' }
  ];

  const formats = [
    { label: 'All Formats', value: '' },
    { label: `PDF Documents (${fmt(formatCounts?.PDF ?? 22865)})`, value: 'PDF' },
    { label: `Images / Screenshots (${fmt(formatCounts?.IMAGE ?? 3069)})`, value: 'IMAGE' },
    { label: `Word DOC/DOCX (${fmt(formatCounts?.DOC ?? 1540)})`, value: 'DOC' },
    { label: `PowerPoint PPT (${fmt(formatCounts?.PPT ?? 529)})`, value: 'PPT' },
    { label: `ZIP Archives (${fmt(formatCounts?.ARCHIVE ?? 185)})`, value: 'ARCHIVE' },
    { label: `Other Formats (${fmt(formatCounts?.OTHER ?? 123)})`, value: 'OTHER' },
    { label: `Text Notes (${fmt(formatCounts?.TXT ?? 17)})`, value: 'TXT' }
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
      className="surface-frosted border border-slate-200/90 rounded-2xl sticky top-16 z-20 shadow-[0_12px_28px_-14px_rgba(15,23,42,0.14)]"
    >
      <div className="py-3 px-4 sm:px-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-0.5 select-none">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Find files</span>
          </div>

          {/* Course Selector */}
          <div className="relative">
            <select
              value={filters.course}
              onChange={(e) => onFilterChange({ ...filters, course: e.target.value })}
              className="h-9 appearance-none celestial-input text-slate-800 text-xs font-semibold rounded-xl pl-3 pr-8 cursor-pointer max-w-[200px] truncate"
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
              className="h-9 appearance-none celestial-input text-slate-800 text-xs font-semibold rounded-xl pl-3 pr-8 cursor-pointer"
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
              className="h-9 appearance-none celestial-input text-slate-800 text-xs font-semibold rounded-xl pl-3 pr-8 cursor-pointer"
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

          <div className="h-4 w-px bg-slate-200/80 mx-0.5 hidden sm:block" aria-hidden="true" />

          {/* Fast Toggle Buttons with spring tap & check animation */}
          <motion.button
            whileHover={{ y: -1.5 }}
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={() => onFilterChange({ ...filters, solvedOnly: !filters.solvedOnly })}
            className={`h-9 inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer border whitespace-nowrap ${
              filters.solvedOnly
                ? 'bg-blue-700 border-blue-700 text-white shadow-xs'
                : 'bg-white/95 border-slate-200/90 text-slate-700 hover:bg-sky-50/70 hover:border-sky-300'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filters.solvedOnly && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                >
                  <Check className="w-3.5 h-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
            <span>Solved Only</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -1.5 }}
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={() => onFilterChange({ ...filters, pastPapersOnly: !filters.pastPapersOnly })}
            className={`h-9 inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer border whitespace-nowrap ${
              filters.pastPapersOnly
                ? 'bg-blue-700 border-blue-700 text-white shadow-xs'
                : 'bg-white/95 border-slate-200/90 text-slate-700 hover:bg-sky-50/70 hover:border-sky-300'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filters.pastPapersOnly && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                >
                  <Check className="w-3.5 h-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
            <span>Past Papers</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -1.5 }}
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={handleToggleMcq}
            className={`h-9 inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer border whitespace-nowrap ${
              isMcqActive
                ? 'bg-blue-700 border-blue-700 text-white shadow-xs'
                : 'bg-white/95 border-slate-200/90 text-slate-700 hover:bg-sky-50/70 hover:border-sky-300'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {isMcqActive && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                >
                  <Check className="w-3.5 h-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
            <span>MCQ Files</span>
          </motion.button>

          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.88, x: -6 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.88, x: -6 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={handleReset}
                className="h-9 inline-flex items-center gap-1 px-3 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200 whitespace-nowrap"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFilterCount})</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Results per page / limit with sliding layoutId pill */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 shrink-0">
          <span className="hidden xl:block text-slate-400 font-normal">
            Tip: pick your course, then a type — or type a course code like CS101 in the search above.
          </span>
          <span className="text-slate-600 font-medium tabular-nums">
            <strong className="text-slate-900 font-mono font-bold">{totalFiltered}</strong> of{' '}
            <strong className="text-slate-900 font-mono font-bold">{totalMatching.toLocaleString()}</strong> files
          </span>
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            {[12, 24, 48, 96].map((l) => {
              const active = limit === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => onLimitChange(l)}
                  className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer font-mono tabular-nums ${
                    active ? 'text-white font-bold' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-limit-pill"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-[#0B1526] rounded-lg shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{l}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
};
