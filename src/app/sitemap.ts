import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { LOCALES, localePath } from "@/lib/i18n/config";

/** Mỗi trang có đủ 3 phiên bản ngôn ngữ, khai báo hreflang để Google hiển thị đúng bản cho từng người tìm kiếm. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories } = await getSiteData();
  const paths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    ...categories.map((c) => ({ path: `/portfolio/${c.slug}`, priority: 0.8 })),
  ];
  const abs = (p: string) => `${SITE_URL}${p === "/" ? "" : p}` || SITE_URL;
  return paths.flatMap(({ path, priority }) => {
    const languages = Object.fromEntries(LOCALES.map((l) => [l, abs(localePath(l, path))]));
    return LOCALES.map((l) => ({
      url: abs(localePath(l, path)) || SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: l === "vi" ? priority : priority * 0.9,
      alternates: { languages },
    }));
  });
}
