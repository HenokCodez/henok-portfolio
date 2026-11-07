import { useState } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { Stats } from '../about/Stats';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function AboutTeaser() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="py-section pt-16 md:pt-24 bg-bg border-t border-line">
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-10 md:gap-20 items-center">
          {/* Left: Portrait Card */}
          <Reveal>
            <div className="relative aspect-[4/5] w-full max-w-[440px] mx-auto rounded-card overflow-hidden border border-line bg-gradient-to-b from-[#3a3a40] to-[#121214] flex items-end justify-center">
              {!imgError ? (
                <img
                  src="/images/portrait.png"
                  alt="Henok"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-bottom"
                />
              ) : (
                <div className="relative w-full h-full flex items-end justify-center">
                  <div className="w-[70%] h-[75%] rounded-t-[140px] bg-[#242429] flex flex-col items-center">
                    <div className="w-32 h-36 mt-8 rounded-[45%] bg-[#8c573f]" />
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Right: Copy + Stats + Button */}
          <div>
            <Reveal delay={0.1}>
              <SectionLabel>[ About ]</SectionLabel>
              <p className="font-body text-xl sm:text-2xl md:text-[28px] font-medium leading-[1.3] text-text">
                I&apos;m Henok — a video editor who believes the edit is where a story is actually written.
                I cut for creators, brands and filmmakers who care how it feels, not just how it looks.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12 pt-8 border-t border-line">
                <Stats />
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10">
                <Button to="/about" variant="ghost" size="lg" arrow="right">
                  More about me
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
