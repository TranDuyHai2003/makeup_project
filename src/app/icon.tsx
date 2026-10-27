import { brandName, monogram } from "@/lib/brand";
import { markImage } from "@/lib/brand-images";
import { getSiteData } from "@/lib/data";

/** Favicon (tab trình duyệt) + icon PWA, sinh từ tên nghệ sĩ. Đổi tên trong admin là icon đổi theo. */
export function generateImageMetadata() {
  return [
    { id: "32", size: { width: 32, height: 32 }, contentType: "image/png" },
    { id: "192", size: { width: 192, height: 192 }, contentType: "image/png" },
    { id: "512", size: { width: 512, height: 512 }, contentType: "image/png" },
  ];
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const px = Number(await id) || 32;
  const { settings } = await getSiteData();
  // Tab trình duyệt: hình tròn cho mềm mại; icon PWA: vuông kín để hệ điều hành tự bo góc
  return markImage(monogram(brandName(settings.artist_name)), px, { rounded: px <= 48 });
}
