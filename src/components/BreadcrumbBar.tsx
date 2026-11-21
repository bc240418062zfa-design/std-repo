import React from 'react';
import { Home, ChevronRight, X, ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  actionVariant?: 'clear' | 'back';
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  items,
  actionLabel,
  actionHref,
  onAction,
  actionVariant = 'back'
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white/92 backdrop-blur-md border-b border-slate-200/85 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[42px] py-1.5 flex items-center justify-between gap-3 text-xs">
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex items-center gap-1 overflow-x-auto scrollbar-none whitespace-nowrap">
            {items.map((item, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === items.length - 1;

              return (
                <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-1 shrink-0">
                  {idx > 0 && (
                    <ChevronRight
                      className="w-3.5 h-3.5 text-slate-300 shrink-0"
                      aria-hidden="true"
                    />
                  )}

                  {isLast || !item.href ? (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-950 font-semibold truncate max-w-[220px] sm:max-w-md"
                    >
                      {isFirst && <Home className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-hidden="true" />}
                      <span className="truncate">{item.label}</span>
                    </span>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-600 hover:text-blue-700 hover:bg-sky-50/80 transition-colors font-medium"
                    >
                      {isFirst && <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />}
                      <span>{item.label}</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {actionLabel && onAction && (
          actionHref ? (
            <a
              href={actionHref}
              onClick={(e) => {
                e.preventDefault();
                onAction();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200/90 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-slate-700 hover:text-blue-700 font-semibold transition-colors shrink-0"
            >
              {actionVariant === 'clear' ? (
                <X className="w-3 h-3" aria-hidden="true" />
              ) : (
                <ArrowLeft className="w-3 h-3" aria-hidden="true" />
              )}
              <span>{actionLabel}</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200/90 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 font-semibold transition-colors cursor-pointer shrink-0"
            >
              {actionVariant === 'clear' ? (
                <X className="w-3 h-3" aria-hidden="true" />
              ) : (
                <ArrowLeft className="w-3 h-3" aria-hidden="true" />
              )}
              <span>{actionLabel}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
