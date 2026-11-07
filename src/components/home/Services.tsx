import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

export function Services() {
  return (
    <section className="py-section pt-16 md:pt-20 bg-bg border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            label="[ 03 — What I do ]"
            title="SERVICES"
          />
        </Reveal>

        <div className="divide-y divide-line border-b border-line">
          {siteConfig.services.map((service, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            return (
              <Reveal key={service.title} delay={idx * 0.08}>
                <Link
                  to="/contact"
                  className="group relative block py-7 md:py-[34px] transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-accent-soft hover:to-transparent"
                >
                  <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[90px_1.2fr_1fr_60px] md:gap-6 transition-transform duration-300 ease-out group-hover:translate-x-3">
                    {/* Number */}
                    <span className="font-mono text-xs md:text-sm uppercase tracking-mono text-muted group-hover:text-accent transition-colors">
                      {num}
                    </span>

                    {/* Title */}
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-[40px] uppercase tracking-[-0.03em] leading-tight text-text group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>

                    {/* Description (Hidden on mobile) */}
                    <p className="hidden md:block text-muted text-base leading-relaxed max-w-[420px]">
                      {service.text}
                    </p>

                    {/* Arrow Circle */}
                    <div className="flex justify-end">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-line-strong flex items-center justify-center text-sm md:text-base text-text transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-accent-ink group-hover:rotate-45">
                        ↗
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
