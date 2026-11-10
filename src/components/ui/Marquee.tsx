import React from 'react';
import { cn } from '../../lib/cn';

export interface MarqueeProps {
  items: string[];
  className?: string;
  speedSec?: number;
}

export function Marquee({ items, className, speedSec = 40 }: MarqueeProps) {
  return (
    <div
      className={cn(
        'group relative w-full overflow-hidden border-y border-line py-5 select-none bg-surface/30',
        className,
      )}
    >
      <div
        className="flex w-max animate-marquee gap-8 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speedSec}s` }}
      >
        <div className="flex shrink-0 items-center gap-8">
          {items.map((item, idx) => (
            <React.Fragment key={`orig-${idx}`}>
              <span className="font-display text-sm md:text-base font-bold uppercase tracking-wider text-muted">
                {item}
              </span>
              <span className="text-accent text-xs">•</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-8" aria-hidden="true">
          {items.map((item, idx) => (
            <React.Fragment key={`dup-${idx}`}>
              <span className="font-display text-sm md:text-base font-bold uppercase tracking-wider text-muted">
                {item}
              </span>
              <span className="text-accent text-xs">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
