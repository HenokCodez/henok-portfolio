import { cn } from '../../lib/cn';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'on' | 'acc';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Chip({
  variant = 'default',
  size = 'sm',
  className,
  children,
  ...props
}: ChipProps) {
  const variantClasses = {
    default: 'bg-bg/50 text-text border-line-strong backdrop-blur-md',
    on: 'bg-text text-bg border-text font-semibold',
    acc: 'bg-accent-soft text-accent border-accent/50',
  }[variant];

  const sizeClasses = {
    sm: 'h-[26px] px-3 text-[10px]',
    md: 'h-[38px] px-4 text-xs',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-mono tracking-wider uppercase select-none transition-colors duration-200',
        sizeClasses,
        variantClasses,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
