import { siteConfig } from '../../config/site';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function Toolkit() {
  return (
    <section className="py-section pt-10 md:pt-16 bg-bg border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            label="[ Toolkit ]"
            title="TOOLS I"
            accentWord="use"
          />
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {siteConfig.tools.map((tool, idx) => {
            const num = String(idx + 1).padStart(2, '0');

            return (
              <Reveal key={tool} delay={idx * 0.05}>
                <div className="p-5.5 rounded-card bg-surface border border-line flex items-center justify-between hover:border-accent hover:shadow-[0_0_20px_-5px_rgba(255,77,31,0.25)] transition-all duration-300 select-none">
                  <span className="font-display font-bold text-base sm:text-lg text-text">
                    {tool}
                  </span>
                  <span className="font-mono text-xs uppercase text-muted">
                    {num}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
