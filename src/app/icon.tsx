import { markImage } from "@/lib/brand-images";

/** Favicon (tab trình duyệt) + icon PWA: biểu tượng mắt khép + hàng mi. */
export function generateImageMetadata() {
  return [
    { id: "32", size: { width: 32, height: 32 }, contentType: "image/png" },
    { id: "192", size: { width: 192, height: 192 }, contentType: "image/png" },
    { id: "512", size: { width: 512, height: 512 }, contentType: "image/png" },
  ];
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const px = Number(await id) || 32;
  // Tab trình duyệt: hình tròn cho mềm mại; icon PWA: vuông kín để hệ điều hành tự bo góc
  return markImage(px, { rounded: px <= 48 });
}
