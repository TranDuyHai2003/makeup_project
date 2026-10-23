export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function zaloLink(phoneOrId: string | null | undefined): string | null {
  if (!phoneOrId) return null;
  const v = phoneOrId.trim();
  if (v.startsWith("http")) return v;
  return `https://zalo.me/${v.replace(/\s+/g, "")}`;
}

export function telLink(phone: string | null | undefined): string | null {
  if (!phone) return null;
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** facebook.com/<tên> → m.me/<tên> để mở thẳng Messenger. Link khác (profile.php?id=...) giữ nguyên. */
export function messengerLink(facebook: string | null | undefined): string | null {
  if (!facebook) return null;
  const v = facebook.trim();
  if (!v) return null;
  if (/^https?:\/\/(www\.)?m\.me\//i.test(v)) return v;
  const m = v.match(/^(?:https?:\/\/)?(?:www\.|m\.|web\.)?facebook\.com\/([A-Za-z0-9.]+)\/?$/i);
  if (m && m[1].toLowerCase() !== "profile.php") return `https://m.me/${m[1]}`;
  if (!v.includes("/") && !v.includes(".")) return `https://m.me/${v}`;
  return v.startsWith("http") ? v : `https://${v}`;
}
