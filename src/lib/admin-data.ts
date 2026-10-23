import "server-only";
import { createClient } from "./supabase/server";
import type { Category, Photo, Service, Settings, Testimonial } from "./types";

/** Đọc dữ liệu cho trang admin: luôn tươi (không cache), dùng session của admin. */
export async function adminData() {
  const supabase = await createClient();
  const [settings, categories, photos, services, testimonials] = await Promise.all([
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("photos").select("*").order("sort_order").order("created_at", { ascending: false }),
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
  ]);
  return {
    settings: (settings.data as Settings | null) ?? ({ id: 1 } as Settings),
    categories: (categories.data as Category[] | null) ?? [],
    photos: (photos.data as Photo[] | null) ?? [],
    services: (services.data as Service[] | null) ?? [],
    testimonials: (testimonials.data as Testimonial[] | null) ?? [],
  };
}
