import { siteConfig } from '../../config/site';
import { useCountUp } from '../../hooks/useCountUp';

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value);

  return (
    <div ref={ref} className="space-y-1">
      <div className="font-display font-extrabold text-4xl sm:text-5xl md:text-[64px] tracking-[-0.04em] leading-none text-text">
        <span>{count}</span>
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="font-mono text-xs uppercase tracking-mono text-muted">
        {label}
      </p>
    </div>
  );
}

export function Stats({ className }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 gap-6 sm:gap-8 ${className || ''}`}>
      {siteConfig.stats.map((s, idx) => (
        <StatItem
          key={idx}
          value={s.value}
          suffix={s.suffix}
          label={s.label}
        />
      ))}
    </div>
  );
}
