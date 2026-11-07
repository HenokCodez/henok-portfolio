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
                    <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
                      {/* Cartoon body */}
                      <div className="absolute bottom-0 w-[72%] h-[48%] rounded-t-[140px] bg-gradient-to-b from-[#1a1a1f] to-[#0e0e12]">
                        <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-[80px] h-[24px] rounded-b-[40px] border-b-[2.5px] border-[#2a2a30]" />
                        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[48px] h-[20px] rounded-b-[30px] border-b-[1px] border-[#8c8a85]/30" />
                      </div>
                      {/* Head */}
                      <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-[42%] aspect-[5/6] rounded-[46%_46%_44%_44%/40%_40%_56%_56%] bg-gradient-to-br from-[#b07a5a] via-[#96644a] to-[#7a4e38]" />
                      {/* Curly hair */}
                      <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 w-[40%] h-[14%] rounded-t-[80px] rounded-b-[8px] bg-[#1a1410]" />
                      <div className="absolute bottom-[63%] left-1/2 -translate-x-1/2 flex gap-[2px]">
                        <div className="w-4 h-4 rounded-full bg-[#1a1410]" />
                        <div className="w-5 h-5 rounded-full bg-[#1a1410] -mt-1" />
                        <div className="w-5 h-5 rounded-full bg-[#1a1410] -mt-1.5" />
                        <div className="w-5 h-5 rounded-full bg-[#1a1410] -mt-1" />
                        <div className="w-4 h-4 rounded-full bg-[#1a1410]" />
                      </div>
                      {/* Glasses */}
                      <div className="absolute bottom-[48%] left-[30%] w-[14%] h-[7%] rounded-[6px] border-[2px] border-[#c0b8a8]" />
                      <div className="absolute bottom-[48%] right-[30%] w-[14%] h-[7%] rounded-[6px] border-[2px] border-[#c0b8a8]" />
                      <div className="absolute bottom-[50.5%] left-1/2 -translate-x-1/2 w-[8%] h-[2px] bg-[#c0b8a8]" />
                      {/* Eyes */}
                      <div className="absolute bottom-[49%] left-[34%] w-3 h-2.5 rounded-full bg-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a0f08] mt-[3px] ml-[4px]" />
                      </div>
                      <div className="absolute bottom-[49%] right-[34%] w-3 h-2.5 rounded-full bg-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a0f08] mt-[3px] ml-[4px]" />
                      </div>
                      {/* Goatee */}
                      <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-[10%] h-[6%] rounded-b-[12px] bg-[#1a1410]/50" />
                      {/* Headphones headband */}
                      <div className="absolute bottom-[58%] left-1/2 -translate-x-1/2 w-[52%] h-[16%] rounded-t-[100px] border-t-[4px] border-l-[4px] border-r-[4px] border-[#2a2a30] bg-transparent" />
                      {/* Headphone cups */}
                      <div className="absolute bottom-[46%] left-[22%] w-[7%] h-[10%] rounded-[8px] bg-[#2a2a30] border border-[#3a3a40]" />
                      <div className="absolute bottom-[46%] right-[22%] w-[7%] h-[10%] rounded-[8px] bg-[#2a2a30] border border-[#3a3a40]" />
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
