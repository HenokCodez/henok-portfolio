import { cn } from '../../lib/cn';

export interface SectionLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function SectionLabel({ className, children, ...props }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'font-mono text-[11px] uppercase tracking-mono text-muted mb-[18px] select-none',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
