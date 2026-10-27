import { markImage } from "@/lib/brand-images";

/** Icon khi khách "Thêm vào màn hình chính" trên iPhone. iOS tự bo góc. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return markImage(180);
}
