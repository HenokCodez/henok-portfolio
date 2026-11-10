import { usePageMeta } from '../hooks/usePageMeta';
import { Hero } from '../components/home/Hero';
import { Marquee } from '../components/ui/Marquee';
import { SelectedWork } from '../components/home/SelectedWork';
import { Showreel } from '../components/home/Showreel';
import { Services } from '../components/home/Services';
import { Testimonials } from '../components/home/Testimonials';
import { AboutTeaser } from '../components/home/AboutTeaser';
import { CTASection } from '../components/home/CTASection';

const MARQUEE_ITEMS = [
  'Premiere Pro',
  'After Effects',
  'Remotion',
  'ElevenLabs',
  'Claude & Google Flow',
  'AI Image & Video',
  'Local AI Tools',
  'Sound Design',
  'Color Grading',
  'Storytelling',
];

export default function Home() {
  usePageMeta(
    'Henok — Video Editor & Visual Storyteller',
    'Cinematic video editing portfolio for creators, brands and filmmakers. Cutting stories with rhythm, restraint and obsession.',
  );

  return (
    <div className="w-full">
      {/* [2]-[7] Hero */}
      <Hero />

      {/* [8] Marquee */}
      <Marquee items={MARQUEE_ITEMS} />

      {/* [9] Selected Work */}
      <SelectedWork />

      {/* [10] Showreel & Timeline */}
      <Showreel />

      {/* [11] Services */}
      <Services />

      {/* [12] Testimonials */}
      <Testimonials />

      {/* [13] About Teaser */}
      <AboutTeaser />

      {/* [14] CTA */}
      <CTASection />
    </div>
  );
}
