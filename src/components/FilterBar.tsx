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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
      className="celestial-bezel rounded-2xl sticky top-16 z-20 shadow-[0_12px_32px_-12px_rgba(30,58,138,0.16)]"
    >
      <div className="surface-frosted rounded-[15px] py-3 px-4 sm:px-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-0.5 select-none">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filter</span>
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
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-[0_6px_16px_-4px_rgba(37,99,235,0.45)]'
                : 'bg-white/90 border-slate-200/90 text-slate-700 hover:bg-blue-50/70 hover:border-blue-300'
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
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-[0_6px_16px_-4px_rgba(37,99,235,0.45)]'
                : 'bg-white/90 border-slate-200/90 text-slate-700 hover:bg-blue-50/70 hover:border-blue-300'
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
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-[0_6px_16px_-4px_rgba(37,99,235,0.45)]'
                : 'bg-white/90 border-slate-200/90 text-slate-700 hover:bg-blue-50/70 hover:border-blue-300'
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
                      className="absolute inset-0 bg-gradient-to-r from-[#070E1F] to-blue-900 rounded-lg shadow-xs"
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
