/**
 * Tiện ích Cloudinary dùng được ở cả client và server (không import SDK ở đây).
 * Ảnh Cloudinary được tối ưu qua URL: f_auto (định dạng tốt nhất), q_auto (nén tự động), w_xxx (resize).
 */
const WIDTHS = [400, 640, 800, 1024, 1280, 1600, 1920];

export function isCloudinaryUrl(url: string): boolean {
  return /res\.cloudinary\.com\/.+\/upload\//.test(url);
}

/** Trả về URL Cloudinary với transformation. Với URL khác (ảnh mẫu), trả về nguyên bản. */
export function cldUrl(url: string, width?: number, extra?: string): string {
  if (!isCloudinaryUrl(url)) return url;
  const t = ["f_auto", "q_auto", width ? `w_${width}` : null, "c_limit", extra]
    .filter(Boolean)
    .join(",");
  return url.replace("/upload/", `/upload/${t}/`);
}

/** Tạo srcset responsive cho ảnh Cloudinary. */
export function cldSrcSet(url: string, maxWidth = 1920): string | undefined {
  if (!isCloudinaryUrl(url)) return undefined;
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${cldUrl(url, w)} ${w}w`)
    .join(", ");
}

/** Ảnh placeholder siêu nhỏ, mờ, dùng khi ảnh chính đang tải. */
export function cldBlurUrl(url: string): string | undefined {
  if (!isCloudinaryUrl(url)) return undefined;
  return url.replace("/upload/", "/upload/f_auto,q_auto:low,w_24,e_blur:1000/");
}
