import { siteConfig } from '../../config/site';
import { SectionLabel } from '../ui/SectionLabel';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function CTASection() {
  return (
    <section className="relative w-full py-28 md:py-40 overflow-hidden bg-bg border-t border-line text-center select-none">
      {/* Subtle Breathing Radial Glow at Bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-end justify-center"
      >
        <div className="w-[120%] h-[70%] bg-[radial-gradient(50%_60%_at_50%_100%,rgba(255,77,31,0.22),transparent_70%)] animate-pulse" />
      </div>

      <div className="container-x relative z-10 flex flex-col items-center">
        <Reveal>
          <SectionLabel className="mb-7">[ 05 — Contact ]</SectionLabel>
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            className="font-display font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-text"
            style={{ fontSize: 'clamp(44px, 8.5vw, 130px)' }}
          >
            LET&apos;S MAKE<br />
            SOMETHING<br />
            <span className="font-serif italic lowercase text-accent tracking-[-0.01em] text-[1.02em]">
              worth watching.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 md:mt-14 flex flex-wrap items-center justify-center gap-4">
            <Button
              href={`mailto:${siteConfig.email}`}
              variant="accent"
              size="lg"
              arrow="up-right"
            >
              {siteConfig.email}
            </Button>

            {siteConfig.bookingUrl ? (
              <Button
                href={siteConfig.bookingUrl}
                variant="ghost"
                size="lg"
                arrow="none"
              >
                Book a call
              </Button>
            ) : (
              <Button
                to="/contact"
                variant="ghost"
                size="lg"
                arrow="none"
              >
                Book a call
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
