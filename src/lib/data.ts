import { cacheLife, cacheTag } from "next/cache";
import { isSupabaseConfigured } from "./env";
import { mockData } from "./mock-data";
import { createPublicClient } from "./supabase/public";
import type { Category, Photo, Service, Settings, SiteData, Testimonial } from "./types";

/** Tag cache dùng chung. Admin ghi dữ liệu xong gọi updateTag(SITE_TAG) để trang public cập nhật ngay. */
export const SITE_TAG = "site";

/**
 * Lấy toàn bộ dữ liệu trang public trong MỘT lần, được cache đến khi admin sửa.
 * Nhờ vậy trang public gần như tĩnh và tải tức thì.
 */
export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheTag(SITE_TAG);
  cacheLife("max");

  if (!isSupabaseConfigured()) return mockData;

  const supabase = createPublicClient();
  const [settings, categories, photos, services, testimonials] = await Promise.all([
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("photos").select("*").order("sort_order").order("created_at", { ascending: false }),
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
  ]);

  const firstError = [settings, categories, photos, services, testimonials].find((r) => r.error)?.error;
  if (firstError) {
    console.error("[supabase] read failed:", firstError.message);
  }

  return {
    settings: (settings.data as Settings | null) ?? { ...mockData.settings, artist_name: "Makeup Artist", tagline: null, bio: null, avatar_url: null, hero_url: null, phone: null, zalo: null, facebook: null, instagram: null, tiktok: null, address: null, years_exp: null, clients_count: null },
    categories: (categories.data as Category[] | null) ?? [],
    photos: (photos.data as Photo[] | null) ?? [],
    services: (services.data as Service[] | null) ?? [],
    testimonials: (testimonials.data as Testimonial[] | null) ?? [],
  };
}
