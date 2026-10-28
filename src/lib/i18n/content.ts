import type { Category, Photo, Service, Settings, SiteData, Testimonial } from "@/lib/types";
import { DEFAULT_LOCALE, type Locale, type TranslatedLocale } from "./config";

/**
 * Bản dịch nội dung nhập trong admin, lưu ở cột jsonb `i18n` của mỗi bảng:
 *   { "en": { "tagline": "...", "bio": "..." }, "zh-TW": { "tagline": "..." } }
 * Ô trống hoặc thiếu → dùng bản tiếng Việt gốc.
 */
export type Translations = Partial<Record<TranslatedLocale, Record<string, string | null | undefined>>>;

/** Các trường được dịch của từng loại nội dung. */
export const TRANSLATABLE = {
  settings: ["tagline", "bio", "address"],
  categories: ["name"],
  services: ["title", "description"],
  testimonials: ["content"],
  photos: ["caption"],
} as const;

function pick<T extends { i18n?: Translations | null }>(row: T, lang: Locale, fields: readonly string[]): T {
  if (lang === DEFAULT_LOCALE || !row.i18n) return row;
  const tr = row.i18n[lang as TranslatedLocale];
  if (!tr) return row;
  const out: Record<string, unknown> = { ...row };
  for (const f of fields) {
    const v = tr[f];
    if (typeof v === "string" && v.trim()) out[f] = v;
  }
  return out as T;
}

export function localizeSettings(s: Settings, lang: Locale): Settings {
  return pick(s, lang, TRANSLATABLE.settings);
}

/** Trả về dữ liệu trang đã thay bằng bản dịch của ngôn ngữ đang xem. */
export function localizeSiteData(data: SiteData, lang: Locale): SiteData {
  if (lang === DEFAULT_LOCALE) return data;
  return {
    settings: localizeSettings(data.settings, lang),
    categories: data.categories.map((c) => pick<Category>(c, lang, TRANSLATABLE.categories)),
    photos: data.photos.map((p) => pick<Photo>(p, lang, TRANSLATABLE.photos)),
    services: data.services.map((s) => pick<Service>(s, lang, TRANSLATABLE.services)),
    testimonials: data.testimonials.map((t) => pick<Testimonial>(t, lang, TRANSLATABLE.testimonials)),
  };
}
