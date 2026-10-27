import { brandName, monogram } from "@/lib/brand";
import { markImage } from "@/lib/brand-images";
import { getSiteData } from "@/lib/data";

/** Icon khi khách "Thêm vào màn hình chính" trên iPhone. iOS tự bo góc. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const { settings } = await getSiteData();
  return markImage(monogram(brandName(settings.artist_name)), 180);
}
