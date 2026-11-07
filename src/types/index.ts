export type Category = 'Documentary' | 'YouTube' | 'Shorts' | 'Commercials';

export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  youtube_id: string;
  category: Category;
  client: string | null;
  role: string | null;
  tools: string[];
  year: number | null;
  thumbnail_url: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  project_type: string;
  budget: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export type NewMessage = Omit<Message, 'id' | 'read' | 'created_at'>;

export interface SiteSettings {
  id: number;
  available: boolean;
  availability_text: string | null;
  email: string | null;
  showreel_youtube_id: string | null;
  showreel_duration: string | null;
  showreel_poster_url?: string | null;
  booking_url: string | null;
  socials: {
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    telegram?: string;
    [key: string]: string | undefined;
  };
}

export interface SiteConfig {
  name: string;
  role: string;
  roleLong: string;
  email: string;
  bookingUrl: string;
  cvUrl: string;
  location: {
    label: string;
    clockCity: string;
    timeZone: string;
    gmt: string;
  };
  socials: {
    youtube: string;
    instagram: string;
    linkedin: string;
    telegram: string;
  };
  available: boolean;
  showreel: {
    youtubeId: string;
    duration: string;
  };
  tools: string[];
  services: {
    title: string;
    text: string;
  }[];
  stats: {
    value: number;
    suffix: string;
    label: string;
  }[];
  experience: {
    years: string;
    role: string;
    place: string;
  }[];
  testimonials: {
    quote: string;
    name: string;
    role: string;
  }[];
  projectTypes: string[];
  budgets: string[];
}

