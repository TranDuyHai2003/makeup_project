import "server-only";
import { ImageResponse } from "next/og";
import { BRAND } from "./brand";
import { cldUrl } from "./cloudinary";
import { markDataUri } from "./logo-mark";
import { ogFonts } from "./og-fonts";

/** Tải ảnh thành data URI; lỗi thì trả null để ảnh chia sẻ vẫn tạo được (chỉ có chữ). */
async function toDataUri(url: string | null | undefined, width: number): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(cldUrl(url, width).replace("f_auto,", "f_jpg,"), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    if (!/^image\/(jpe?g|png)/.test(type)) return null; // Satori chỉ chắc chắn hỗ trợ JPEG/PNG
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

/** Favicon / icon ứng dụng: biểu tượng màu ngà trên nền vàng hồng. */
export function markImage(px: number, opts: { rounded?: boolean } = {}) {
  const src = markDataUri(BRAND.bg, { color: BRAND.rose, round: opts.rounded, scale: opts.rounded ? 0.86 : 0.74 });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <img src={src} width={px} height={px} alt="" />
      </div>
    ),
    { width: px, height: px },
  );
}

const CJK = /[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F]/;

/**
 * Font chữ Hán phồn thể cho ảnh chia sẻ tiếng Trung: tải từ Google Fonts đúng những chữ cần dùng (tham số text=),
 * nên chỉ vài KB. Lỗi mạng → bỏ qua (trình vẽ ảnh tự dùng font dự phòng).
 */
async function loadCjkFonts(text: string) {
  const chars = [...new Set([...text].filter((c) => CJK.test(c)))].join("");
  if (!chars) return [];
  const load = async (family: string, weight: 300 | 500) => {
    try {
      const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(chars)}`, {
        // User-agent cũ để Google trả về TTF/WOFF (trình vẽ ảnh không đọc được WOFF2)
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30 (KHTML, like Gecko) Safari/534.30" },
        signal: AbortSignal.timeout(6000),
      }).then((r) => r.text());
      const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype|woff)'\)/)?.[1];
      if (!url) return null;
      const data = await fetch(url, { signal: AbortSignal.timeout(6000) }).then((r) => r.arrayBuffer());
      return { name: "NotoSerifTC", data, weight, style: "normal" as const };
    } catch {
      return null;
    }
  };
  const fonts = await Promise.all([load("Noto+Serif+TC", 300), load("Noto+Serif+TC", 500)]);
  return fonts.filter((f): f is NonNullable<typeof f> => !!f);
}

type CardInput = {
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  footer?: string | null;
  imageUrl?: string | null;
};

/** Ảnh chia sẻ Facebook / Zalo / Messenger (1200×630). */
export async function shareCard(input: CardInput) {
  // Dữ liệu có thể lưu dấu tiếng Việt dạng tách rời (NFD); trình vẽ ảnh cần dạng dựng sẵn (NFC) để dấu không lệch
  const nfc = (v: string | null | undefined) => (v ? v.normalize("NFC") : v);
  const eyebrow = input.eyebrow.normalize("NFC");
  const title = input.title.normalize("NFC");
  const subtitle = nfc(input.subtitle);
  const footer = nfc(input.footer);
  const [img, cjkFonts] = await Promise.all([
    toDataUri(input.imageUrl, 800),
    loadCjkFonts([eyebrow, title, subtitle, footer].filter(Boolean).join(" ")),
  ]);
  const hasCjk = cjkFonts.length > 0;
  const len = title.length;
  const titleSize = img ? (len > 22 ? 62 : len > 14 ? 78 : 100) : len > 22 ? 84 : 110;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BRAND.bg,
          backgroundImage: `radial-gradient(circle at 92% 8%, ${BRAND.roseSoft} 0%, rgba(243,217,210,0) 45%), radial-gradient(circle at 0% 100%, ${BRAND.bg2} 0%, rgba(247,233,229,0) 50%)`,
          // Chữ Latin dùng Cormorant, chữ Hán rơi xuống Noto Serif TC
          fontFamily: hasCjk ? "Cormorant, NotoSerifTC" : "Cormorant",
          color: BRAND.ink,
          padding: "64px 72px",
        }}
      >
        {/* Cột chữ */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between", paddingRight: img ? 48 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={markDataUri(BRAND.rose)} width={76} height={76} alt="" />
            <div style={{ display: "flex", width: 56, height: 1.5, background: BRAND.rose, opacity: 0.6 }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, letterSpacing: 8, color: BRAND.rose, fontWeight: 500 }}>{eyebrow.toUpperCase()}</div>
            <div style={{ fontSize: titleSize, fontWeight: 300, lineHeight: 1, marginTop: 18, letterSpacing: -1 }}>{title}</div>
            {subtitle ? (
              <div style={{ fontSize: 34, fontStyle: "italic", fontWeight: 300, color: BRAND.muted, marginTop: 24, lineHeight: 1.25 }}>{subtitle}</div>
            ) : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: BRAND.muted, fontWeight: 500 }}>
            {footer ? <div style={{ display: "flex" }}>{footer}</div> : <div style={{ display: "flex" }} />}
          </div>
        </div>

        {/* Ảnh trong khung vòm, giống hero trên trang */}
        {img ? (
          <div style={{ display: "flex", position: "relative", width: 378, height: 502 }}>
            <div
              style={{
                position: "absolute",
                left: 18,
                top: 18,
                width: 378,
                height: 502,
                border: `1.5px solid ${BRAND.rose}`,
                borderTopLeftRadius: 189,
                borderTopRightRadius: 189,
                opacity: 0.6,
              }}
            />
            <img
              src={img}
              alt=""
              width={378}
              height={502}
              style={{ objectFit: "cover", borderTopLeftRadius: 189, borderTopRightRadius: 189 }}
            />
          </div>
        ) : null}
      </div>
    ),
    { width: 1200, height: 630, fonts: [...ogFonts, ...cjkFonts] },
  );
}
