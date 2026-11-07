import { cn } from '../../lib/cn';

export interface StatCardsProps {
  total: number;
  published: number;
  featured: number;
  newMessages: number;
  className?: string;
}

export function StatCards({
  total,
  published,
  featured,
  newMessages,
  className,
}: StatCardsProps) {
  const cards = [
    { label: 'Total Videos', value: total },
    { label: 'Published', value: published },
    { label: 'Featured', value: featured },
    { label: 'New Messages', value: newMessages, isAccent: true },
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4 mb-7', className)}>
      {cards.map((c) => (
        <div
          key={c.label}
          className="p-5 rounded-card bg-surface border border-line select-none flex flex-col justify-between"
        >
          <span className="font-mono text-[11px] uppercase tracking-mono text-muted mb-2">
            {c.label}
          </span>
          <span
            className={cn(
              'font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-none',
              c.isAccent ? 'text-accent' : 'text-text',
            )}
          >
            {c.value}
          </span>
        </div>
      ))}
    </div>
  );
}
