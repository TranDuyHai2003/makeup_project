import { brandName } from "@/lib/brand";
import { shareCard } from "@/lib/brand-images";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/i18n/server";

/** Ảnh hiện ra khi chia sẻ link trang chủ lên Facebook, Zalo, Messenger (theo ngôn ngữ của link). */
export const alt = "Makeup Artist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const { data, t } = await getLocalized(lang);
  const { settings, categories } = data;
  const name = brandName(settings.artist_name);
  const tags = categories.slice(0, 4).map((c) => c.name).join(" · ");
  return shareCard({
    eyebrow: t.meta.ogEyebrow,
    title: name,
    subtitle: settings.tagline,
    footer: [tags, settings.address].filter(Boolean).join("  —  ") || null,
    imageUrl: settings.hero_url,
  });
}
