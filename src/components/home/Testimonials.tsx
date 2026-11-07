import { siteConfig } from '../../config/site';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function Testimonials() {
  if (!siteConfig.testimonials || siteConfig.testimonials.length === 0) {
    return null;
  }

  // Duplicate to make 3 if only 1 is in sample config, or display up to 3
  const testimonials = siteConfig.testimonials.length >= 3
    ? siteConfig.testimonials.slice(0, 3)
    : [siteConfig.testimonials[0], siteConfig.testimonials[0], siteConfig.testimonials[0]];

  return (
    <section className="py-section pt-16 md:pt-20 bg-bg border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            label="[ 04 — Kind words ]"
            title="CLIENT"
            accentWord="love"
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="h-full min-h-[300px] p-8 rounded-card bg-surface border border-line flex flex-col justify-between select-none">
                <p className="text-lg md:text-xl leading-[1.45] text-text">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-line/60">
                  <div className="w-10 h-10 rounded-full bg-surface-3 border border-line flex items-center justify-center font-mono text-xs text-muted shrink-0">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-text leading-tight">
                      {t.name}
                    </p>
                    <p className="font-mono text-xs text-muted leading-tight mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
