/**
 * Nhận diện thương hiệu sinh tự động từ tên nghệ sĩ (sửa trong admin → Cài đặt).
 * Dùng chung cho logo trên trang, favicon, icon iPhone và ảnh chia sẻ mạng xã hội.
 */
export const BRAND = {
  bg: "#fcf6f4",
  bg2: "#f7e9e5",
  ink: "#2b1f1f",
  muted: "#83706c",
  rose: "#a96b5e",
  roseSoft: "#f3d9d2",
};

// Những từ chung chung không dùng để tạo chữ lồng
const GENERIC = new Set(["makeup", "make", "up", "artist", "mua", "studio", "beauty", "by", "the", "&", "and", "và"]);

/**
 * "Trà My Makeup" → "TM", "Nguyễn Trà My" → "TM" (tên Việt: bỏ họ, lấy tên gọi), "Makeup Artist 1" → "MA".
 * Từ 3 chữ trở lên lấy 2 chữ cuối, vì họ người Việt đứng đầu và tên gọi đứng cuối.
 */
export function monogram(name: string | null | undefined): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const meaningful = words.filter((w) => !GENERIC.has(w.toLowerCase()) && /\p{L}/u.test(w));
  const letters_ = (meaningful.length ? meaningful : words).filter((w) => /\p{L}/u.test(w));
  const pick = letters_.length >= 3 ? letters_.slice(-2) : letters_.slice(0, 2);
  const letters = pick.map((w) => [...w.normalize("NFC")].find((c) => /\p{L}/u.test(c)) ?? "").join("");
  return (letters || "M").toLocaleUpperCase("vi");
}

export function brandName(name: string | null | undefined): string {
  return name?.trim() || "Makeup Artist";
}
