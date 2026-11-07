import { cn } from '../../lib/cn';

export type ViewMode = 'grid' | 'list';

export interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggle({ mode, onChange, className }: ViewToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] select-none',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-pressed={mode === 'grid'}
        aria-label="Grid view"
        className={cn(
          'transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
          mode === 'grid'
            ? 'text-text underline decoration-1 underline-offset-4'
            : 'text-muted hover:text-text',
        )}
      >
        GRID
      </button>

      <span className="text-line-strong">/</span>

      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={mode === 'list'}
        aria-label="List view"
        className={cn(
          'transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
          mode === 'list'
            ? 'text-text underline decoration-1 underline-offset-4'
            : 'text-muted hover:text-text',
        )}
      >
        LIST
      </button>
    </div>
  );
}
