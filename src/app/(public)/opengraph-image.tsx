import { brandName, monogram } from "@/lib/brand";
import { shareCard } from "@/lib/brand-images";
import { getSiteData } from "@/lib/data";

/** Ảnh hiện ra khi chia sẻ link trang chủ lên Facebook, Zalo, Messenger. */
export const alt = "Makeup Artist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const { settings, categories } = await getSiteData();
  const name = brandName(settings.artist_name);
  const tags = categories.slice(0, 4).map((c) => c.name).join(" · ");
  return shareCard({
    initials: monogram(name),
    eyebrow: "Makeup Artist",
    title: name,
    subtitle: settings.tagline,
    footer: [tags, settings.address].filter(Boolean).join("  —  ") || null,
    imageUrl: settings.hero_url,
  });
}
