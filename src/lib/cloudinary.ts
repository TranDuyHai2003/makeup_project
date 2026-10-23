/**
 * Tiện ích tối ưu ảnh dùng được ở cả client và server (không import SDK ở đây).
 * - Ảnh Cloudinary: tối ưu qua URL f_auto (định dạng tốt nhất), q_auto (nén tự động), w_xxx (resize).
 * - Ảnh Unsplash (dữ liệu mẫu): đổi tham số w= để điện thoại không phải tải ảnh lớn.
 * - Ảnh khác: dùng nguyên URL.
 */
const WIDTHS = [400, 640, 800, 1024, 1280, 1600, 1920];

export function isCloudinaryUrl(url: string): boolean {
  return /res\.cloudinary\.com\/.+\/upload\//.test(url);
}

function isUnsplashUrl(url: string): boolean {
  return url.startsWith("https://images.unsplash.com/");
}

function unsplashUrl(url: string, width?: number, quality = 75): string {
  try {
    const u = new URL(url);
    u.searchParams.set("auto", "format");
    if (!u.searchParams.has("fit")) u.searchParams.set("fit", "crop");
    if (width) u.searchParams.set("w", String(width));
    u.searchParams.set("q", String(quality));
    return u.toString();
  } catch {
    return url;
  }
}

/** Trả về URL ảnh đã resize/tối ưu theo chiều rộng. Với URL không hỗ trợ, trả về nguyên bản. */
export function cldUrl(url: string, width?: number, extra?: string): string {
  if (isUnsplashUrl(url)) return unsplashUrl(url, width);
  if (!isCloudinaryUrl(url)) return url;
  const t = ["f_auto", "q_auto", width ? `w_${width}` : null, "c_limit", extra]
    .filter(Boolean)
    .join(",");
  return url.replace("/upload/", `/upload/${t}/`);
}

/** Tạo srcset responsive. */
export function cldSrcSet(url: string, maxWidth = 1920): string | undefined {
  if (!isCloudinaryUrl(url) && !isUnsplashUrl(url)) return undefined;
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${cldUrl(url, w)} ${w}w`)
    .join(", ");
}

/** Ảnh placeholder siêu nhỏ, mờ, dùng khi ảnh chính đang tải. */
export function cldBlurUrl(url: string): string | undefined {
  if (isUnsplashUrl(url)) return unsplashUrl(url, 24, 30);
  if (!isCloudinaryUrl(url)) return undefined;
  return url.replace("/upload/", "/upload/f_auto,q_auto:low,w_24,e_blur:1000/");
}
