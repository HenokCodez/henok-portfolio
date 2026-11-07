import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '-40px' });
  const prefersReduced = useReducedMotion();

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="hidden min-[701px]:block mt-[14px] px-[14px] py-[10px] rounded-[12px] bg-surface border border-line select-none overflow-hidden relative pointer-events-none opacity-85"
    >
      <div className="space-y-[5px] relative">
        {/* Row V2 */}
        <div className="flex items-center gap-2.5">
          <span className="w-6 font-mono text-[9px] uppercase tracking-wider text-muted">
            V2
          </span>
          <div className="relative flex-1 h-[10px] rounded-[3px] bg-surface-2 overflow-hidden">
            <span
              className="absolute top-[1px] bottom-[1px] rounded-[2px] bg-surface-3"
              style={{ left: '6%', width: '22%' }}
            />
            <span
              className="absolute top-[1px] bottom-[1px] rounded-[2px] bg-accent-soft border border-accent/50"
              style={{ left: '34%', width: '18%' }}
            />
            <span
              className="absolute top-[1px] bottom-[1px] rounded-[2px] bg-surface-3"
              style={{ left: '58%', width: '30%' }}
            />
          </div>
        </div>

        {/* Row V1 */}
        <div className="flex items-center gap-2.5">
          <span className="w-6 font-mono text-[9px] uppercase tracking-wider text-muted">
            V1
          </span>
          <div className="relative flex-1 h-[10px] rounded-[3px] bg-surface-2 overflow-hidden">
            <span
              className="absolute top-[1px] bottom-[1px] rounded-[2px] bg-surface-3"
              style={{ left: '0%', width: '34%' }}
            />
            <span
              className="absolute top-[1px] bottom-[1px] rounded-[2px] bg-surface-3"
              style={{ left: '35%', width: '25%' }}
            />
            <span
              className="absolute top-[1px] bottom-[1px] rounded-[2px] bg-surface-3"
              style={{ left: '61%', width: '39%' }}
            />
          </div>
        </div>

        {/* Row A1 */}
        <div className="flex items-center gap-2.5">
          <span className="w-6 font-mono text-[9px] uppercase tracking-wider text-muted">
            A1
          </span>
          <div className="relative flex-1 h-[10px] rounded-[3px] bg-surface-2 overflow-hidden">
            <span
              className="absolute top-[1px] bottom-[1px] rounded-[2px] bg-surface-3 opacity-60"
              style={{ left: '0%', width: '100%' }}
            />
          </div>
        </div>

        {/* Animated Orange Playhead spanning all tracks */}
        <div className="absolute inset-y-0 left-8 right-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={!prefersReduced && isInView ? { left: ['0%', '100%'] } : { left: '0%' }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: 'linear',
            }}
            className="absolute top-0 bottom-0 w-[2px] bg-accent shadow-[0_0_8px_var(--accent)]"
          />
        </div>
      </div>
    </div>
  );
}
