import { brandName } from "@/lib/brand";
import { shareCard } from "@/lib/brand-images";
import { getCategoryBySlug } from "@/lib/data";

/** Ảnh chia sẻ riêng cho từng album: tên album + ảnh bìa của album. */
export const alt = "Album makeup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function AlbumImage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const data = await getCategoryBySlug(category);
  const name = brandName(data.settings.artist_name);
  const cover = data.photos.find((p) => p.is_featured) ?? data.photos[0];
  return shareCard({
    eyebrow: `Album · ${data.photos.length} ảnh`,
    title: data.category ? `Makeup ${data.category.name}` : name,
    subtitle: name,
    footer: data.settings.address,
    imageUrl: cover?.url ?? data.settings.hero_url,
  });
}
