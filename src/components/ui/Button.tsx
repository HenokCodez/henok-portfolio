import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  arrow?: 'right' | 'up-right' | 'down' | 'none';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      to,
      href,
      arrow = 'none',
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'h-9 px-4 text-[13px] gap-2',
      md: 'h-11 px-5.5 text-sm gap-2.5',
      lg: 'h-[60px] px-8 text-base gap-3',
    }[size];

    const variantClasses = {
      solid: 'bg-text text-bg border border-text hover:bg-text/95',
      accent: 'bg-accent text-accent-ink border border-accent hover:bg-accent/90',
      ghost: 'bg-transparent text-text border border-line-strong hover:bg-surface-2 hover:border-line-strong',
    }[variant];

    const baseClasses = cn(
      'group inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap select-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] hover:-translate-y-0.5',
      sizeClasses,
      variantClasses,
      className,
    );

    const arrowGlyph = {
      right: '→',
      'up-right': '↗',
      down: '↓',
      none: null,
    }[arrow];

    const content = (
      <>
        <span>{children}</span>
        {arrowGlyph && (
          <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
            {arrowGlyph}
          </span>
        )}
      </>
    );

    if (to) {
      return (
        <Link
          to={to}
          className={baseClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    if (href) {
      return (
        <a
          href={href}
          className={baseClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        type="button"
        className={baseClasses}
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
