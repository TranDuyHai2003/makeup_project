/**
 * Cấu hình đa ngôn ngữ (dùng được ở cả server lẫn client).
 * - Tiếng Việt là mặc định, nằm ở "/" (không tiền tố) để link cũ không hỏng.
 * - Tiếng Anh ở "/en", tiếng Trung phồn thể (Đài Loan) ở "/zh-TW".
 */
export const LOCALES = ["vi", "en", "zh-TW"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "vi";
/** Ngôn ngữ có thể dịch nội dung trong admin (ngoài tiếng Việt gốc). */
export const TRANSLATED_LOCALES = ["en", "zh-TW"] as const;
export type TranslatedLocale = (typeof TRANSLATED_LOCALES)[number];

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_META: Record<Locale, { label: string; short: string; htmlLang: string; ogLocale: string; intl: string }> = {
  vi: { label: "Tiếng Việt", short: "VI", htmlLang: "vi", ogLocale: "vi_VN", intl: "vi-VN" },
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_US", intl: "en-US" },
  "zh-TW": { label: "繁體中文", short: "中文", htmlLang: "zh-Hant-TW", ogLocale: "zh_TW", intl: "zh-TW" },
};

export function isLocale(v: string | null | undefined): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

/** Thêm tiền tố ngôn ngữ vào đường dẫn: ("en", "/#contact") → "/en#contact", ("vi", "/portfolio/x") → "/portfolio/x". */
export function localePath(lang: Locale, path = "/"): string {
  if (lang === DEFAULT_LOCALE) return path || "/";
  if (path === "/" || path === "") return `/${lang}`;
  if (path.startsWith("/#")) return `/${lang}${path.slice(1)}`;
  return `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Bỏ tiền tố ngôn ngữ: "/en/portfolio/x" → "/portfolio/x". */
export function stripLocale(pathname: string): string {
  for (const l of LOCALES) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname || "/";
}

/** hreflang cho metadata.alternates.languages (đường dẫn tương đối, metadataBase sẽ ghép domain). */
export function languageAlternates(path = "/"): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[LOCALE_META[l].htmlLang === "zh-Hant-TW" ? "zh-TW" : l] = localePath(l, path);
  out["x-default"] = localePath(DEFAULT_LOCALE, path);
  return out;
}

/** Chọn ngôn ngữ phù hợp từ header Accept-Language của trình duyệt. */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const prefs = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((p) => p.tag && !Number.isNaN(p.q))
    .sort((a, b) => b.q - a.q);
  for (const { tag } of prefs) {
    if (tag.startsWith("vi")) return "vi";
    // Trung phồn thể: zh-TW, zh-HK, zh-MO, zh-Hant. (zh-CN giản thể cũng đưa về đây vì đọc được chữ phồn thể)
    if (tag.startsWith("zh")) return "zh-TW";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}
