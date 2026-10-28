import { brandName } from "@/lib/brand";
import { shareCard } from "@/lib/brand-images";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/format";
import { getLocalized } from "@/lib/i18n/server";

/** Ảnh chia sẻ riêng cho từng album: tên album + ảnh bìa của album, theo ngôn ngữ của link. */
export const alt = "Album makeup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function AlbumImage({ params }: { params: Promise<{ lang: string; category: string }> }) {
  const { lang: raw, category } = await params;
  const lang = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const { data, t } = await getLocalized(lang);
  const cat = data.categories.find((c) => c.slug === category);
  const photos = cat ? data.photos.filter((p) => p.category_id === cat.id) : [];
  const name = brandName(data.settings.artist_name);
  const cover = photos.find((p) => p.is_featured) ?? photos[0];
  return shareCard({
    eyebrow: fmt(t.meta.ogAlbum, { n: photos.length }),
    title: cat ? fmt(t.portfolio.albumTitle, { name: cat.name }) : name,
    subtitle: name,
    footer: data.settings.address,
    imageUrl: cover?.url ?? data.settings.hero_url,
  });
}
