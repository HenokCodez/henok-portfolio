import { motion } from 'framer-motion';
import type { Category } from '../../types';
import { cn } from '../../lib/cn';

export const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Documentary',
  'YouTube',
  'Shorts',
  'Commercials',
];

export interface FilterBarProps {
  activeCategory: Category | 'All';
  onChange: (category: Category | 'All') => void;
  className?: string;
}

export function FilterBar({
  activeCategory,
  onChange,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-full border border-line-strong bg-surface/85 backdrop-blur-[14px] max-w-full overflow-x-auto no-scrollbar select-none',
        className,
      )}
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={cn(
              'relative px-5 py-2.5 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              isActive ? 'text-bg' : 'text-muted hover:text-text',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-text -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            {cat}
          </button>
        );
      })}
    </div>
  );
}
