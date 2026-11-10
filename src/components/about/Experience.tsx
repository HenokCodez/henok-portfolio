import { siteConfig } from '../../config/site';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function Experience() {
  return (
    <section className="py-section pt-10 md:pt-16 bg-bg border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            label="[ Experience ]"
            title="WHERE I'VE"
            accentWord="been"
          />
        </Reveal>

        <div className="divide-y divide-line border-b border-line">
          {siteConfig.experience.map((item, idx) => (
            <Reveal key={idx} delay={idx * 0.08}>
              <div className="group relative py-6 md:py-8 transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-accent-soft hover:to-transparent">
                <div className="flex flex-col sm:grid sm:grid-cols-[200px_1.4fr_1fr_40px] gap-2 sm:gap-6 items-start sm:items-center transition-transform duration-300 ease-out group-hover:translate-x-2">
                  {/* Years */}
                  <span className="font-mono text-xs uppercase tracking-mono text-muted group-hover:text-accent transition-colors">
                    {item.years}
                  </span>

                  {/* Role */}
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl md:text-[34px] uppercase tracking-[-0.03em] leading-tight text-text group-hover:text-accent transition-colors">
                    {item.role}
                  </h3>

                  {/* Place */}
                  <span className="text-muted text-sm sm:text-base">
                    {item.place}
                  </span>

                  {/* Empty 4th column for alignment */}
                  <div className="hidden sm:block" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
