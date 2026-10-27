import type { MetadataRoute } from "next";
import { BRAND, brandName } from "@/lib/brand";
import { getSiteData } from "@/lib/data";

/** Cho phép "Thêm vào màn hình chính" trên điện thoại với tên + icon riêng. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { settings } = await getSiteData();
  const name = brandName(settings.artist_name);
  return {
    name: `${name} · Makeup Artist`,
    short_name: name.length > 12 ? name.split(/\s+/).slice(0, 2).join(" ") : name,
    description: settings.tagline ?? "Portfolio makeup artist",
    start_url: "/",
    display: "standalone",
    background_color: BRAND.bg,
    theme_color: BRAND.bg,
    lang: "vi",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
