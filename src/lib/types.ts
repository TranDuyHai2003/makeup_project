export type Settings = {
  id: number;
  artist_name: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
  hero_url: string | null;
  phone: string | null;
  zalo: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  address: string | null;
  years_exp: number | null;
  clients_count: number | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type Photo = {
  id: string;
  url: string;
  public_id: string;
  before_url: string | null;
  category_id: string | null;
  caption: string | null;
  is_featured: boolean;
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string;
};

export type Service = {
  id: string;
  title: string | null;
  description: string | null;
  price_from: number | null;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  client_name: string | null;
  content: string | null;
  photo_url: string | null;
  rating: number;
};

export type SiteData = {
  settings: Settings;
  categories: Category[];
  photos: Photo[];
  services: Service[];
  testimonials: Testimonial[];
};
