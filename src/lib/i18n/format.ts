import { LOCALE_META, type Locale } from "./config";

/** Điền chỗ trống: fmt("Xem thêm {n} ảnh", { n: 12 }) → "Xem thêm 12 ảnh". */
export function fmt(template: string, vars: Record<string, string | number | null | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

/** Giá theo định dạng số của từng ngôn ngữ, đơn vị luôn là VND. */
export function formatPriceIntl(value: number | null | undefined, lang: Locale, p: { contact: string; currencyPrefix: string; currencySuffix: string }): string {
  if (value == null) return p.contact;
  return `${p.currencyPrefix}${new Intl.NumberFormat(LOCALE_META[lang].intl).format(value)}${p.currencySuffix}`;
}

/** Nối danh sách: ["Messenger","Zalo"] → "Messenger hoặc Zalo" / "Messenger, Zalo or Instagram". */
export function joinOr(items: string[], or: string, lang: Locale): string {
  if (items.length <= 1) return items[0] ?? "";
  const sep = lang === "zh-TW" ? "、" : ", ";
  return `${items.slice(0, -1).join(sep)} ${or} ${items[items.length - 1]}`;
}
