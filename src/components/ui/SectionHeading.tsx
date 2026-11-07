import { SectionLabel } from './SectionLabel';
import { cn } from '../../lib/cn';

export interface SectionHeadingProps {
  label?: string;
  title: string;
  accentWord?: string;
  suffix?: string;
  count?: string;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  accentWord,
  suffix,
  count,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14',
        className,
      )}
    >
      <div>
        {label && <SectionLabel>{label}</SectionLabel>}
        <h2 className="display text-h2">
          {title}
          {accentWord && (
            <>
              {' '}
              <span className="serif-accent">{accentWord}</span>
            </>
          )}
          {suffix && <> {suffix}</>}
        </h2>
      </div>

      {count && (
        <span className="font-mono text-sm tracking-widest text-muted sm:mb-2 self-start sm:self-end">
          {count}
        </span>
      )}
    </div>
  );
}
