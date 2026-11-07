import { usePageMeta } from '../hooks/usePageMeta';
import { SectionLabel } from '../components/ui/SectionLabel';
import { ContactForm } from '../components/contact/ContactForm';
import { ContactAside } from '../components/contact/ContactAside';
import { Reveal } from '../components/ui/Reveal';

export default function Contact() {
  usePageMeta(
    'Contact — Henok',
    'Get in touch with Henok for video editing, motion graphics, and visual storytelling projects.',
  );

  return (
    <div className="w-full">
      {/* Title Header */}
      <section className="pt-28 sm:pt-36 md:pt-[170px] pb-10 border-b border-line bg-bg">
        <div className="container-x">
          <Reveal>
            <SectionLabel>[ Contact ]</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="font-display font-extrabold uppercase leading-[0.85] tracking-display text-text"
              style={{ fontSize: 'clamp(52px, 11vw, 176px)' }}
            >
              LET&apos;S <span className="serif-accent">talk.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="pt-10 pb-24 md:pb-40 bg-bg">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-12 md:gap-20 items-start">
            {/* Form (Left on Desktop, First on Mobile) */}
            <div className="w-full">
              <Reveal delay={0.15}>
                <ContactForm />
              </Reveal>
            </div>

            {/* Aside Cards (Right) */}
            <div className="w-full">
              <Reveal delay={0.25}>
                <ContactAside />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
