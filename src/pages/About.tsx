import { useState } from 'react';
import { siteConfig } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Stats } from '../components/about/Stats';
import { Experience } from '../components/about/Experience';
import { Toolkit } from '../components/about/Toolkit';
import { Testimonials } from '../components/home/Testimonials';
import { CTASection } from '../components/home/CTASection';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';

export default function About() {
  usePageMeta(
    'About — Henok',
    'Learn about Henok, a video editor and visual storyteller with 5+ years of experience cutting cinematic stories.',
  );

  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full">
      {/* [2] Title Block */}
      <section className="pt-28 sm:pt-36 md:pt-[170px] pb-10 border-b border-line bg-bg">
        <div className="container-x">
          <Reveal>
            <SectionLabel>[ About ]</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="font-display font-extrabold uppercase leading-[0.85] tracking-display text-text"
              style={{ fontSize: 'clamp(44px, 8.5vw, 130px)' }}
            >
              THE PERSON<br />
              BEHIND THE <span className="serif-accent">cut.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* [3]-[6] Bio Section with Sticky Portrait */}
      <section className="py-16 md:py-24 bg-bg">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-12 md:gap-20 items-start">
            {/* [4] Left: Portrait (Sticky on Desktop) */}
            <div className="md:sticky md:top-28">
              <Reveal>
                <div className="relative aspect-[4/5] w-full max-w-[460px] mx-auto rounded-card overflow-hidden border border-line bg-gradient-to-b from-[#3a3a40] to-[#121214] flex items-end justify-center">
                  {!imgError ? (
                    <img
                      src="/images/portrait.png"
                      alt="Henok"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover object-bottom"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-end justify-center">
                      <div className="w-[72%] h-[78%] rounded-t-[140px] bg-[#242429] flex flex-col items-center">
                        <div className="w-36 h-40 mt-10 rounded-[45%] bg-[#8c573f]" />
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>

            {/* [5] Right: Bio Copy, Stats & Action Buttons */}
            <div className="space-y-8">
              <Reveal delay={0.1}>
                <p className="font-display font-medium text-2xl sm:text-3xl md:text-[36px] tracking-[-0.02em] leading-tight text-text">
                  I believe editing isn&apos;t just about cutting footage together — it&apos;s about finding the heartbeat of a story and amplifying it.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="space-y-5 text-muted text-base md:text-lg leading-relaxed max-w-[640px]">
                  <p>
                    Over the past five years, I&apos;ve collaborated with YouTube creators, independent filmmakers, and global brands to craft visuals that captivate audiences and hold attention through intentional rhythm and pacing.
                  </p>
                  <p>
                    From fast-paced short-form hooks to immersive feature-length documentaries, every cut is driven by emotional resonance, meticulous sound design, and tailored color grading.
                  </p>
                </div>
              </Reveal>

              {/* [6] Stats */}
              <Reveal delay={0.25}>
                <div className="mt-12 pt-8 border-t border-line">
                  <Stats />
                </div>
              </Reveal>

              {/* Buttons Row */}
              <Reveal delay={0.3}>
                <div className="mt-10 flex flex-wrap items-center gap-3.5">
                  {siteConfig.cvUrl && (
                    <Button
                      href={siteConfig.cvUrl}
                      variant="solid"
                      size="lg"
                      arrow="down"
                    >
                      Download CV
                    </Button>
                  )}
                  <Button to="/contact" variant="ghost" size="lg" arrow="none">
                    Let&apos;s talk
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* [7] Experience */}
      <Experience />

      {/* [8] Toolkit */}
      <Toolkit />

      {/* [9] Testimonials */}
      <Testimonials />

      {/* [10] CTA Section */}
      <CTASection />
    </div>
  );
}
