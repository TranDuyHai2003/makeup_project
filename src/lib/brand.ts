/**
 * Nhận diện thương hiệu.
 * Màu thương hiệu dùng cho favicon, icon và ảnh chia sẻ (khớp với token trong globals.css).
 */
export const BRAND = {
  bg: "#fcf6f4",
  bg2: "#f7e9e5",
  ink: "#2b1f1f",
  muted: "#83706c",
  rose: "#a96b5e",
  roseSoft: "#f3d9d2",
};

export function brandName(name: string | null | undefined): string {
  return name?.trim() || "Makeup Artist";
}
