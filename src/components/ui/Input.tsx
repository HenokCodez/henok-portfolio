import React from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'underline' | 'boxed';
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'boxed', label, error, className, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block font-mono text-[11px] uppercase tracking-mono text-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full text-text transition-all duration-200 focus:outline-none disabled:opacity-50',
            variant === 'underline'
              ? 'h-14 bg-transparent border-b border-line-strong text-lg focus:border-accent placeholder:text-faint'
              : 'h-12 px-4 rounded-xl bg-surface border border-line-strong text-sm focus:border-accent focus:ring-1 focus:ring-accent-soft placeholder:text-faint',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger font-mono">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
