import "server-only";
import { ImageResponse } from "next/og";
import { BRAND } from "./brand";
import { cldUrl } from "./cloudinary";
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

/** Favicon / icon ứng dụng: chữ lồng trắng ngà trên nền vàng hồng. */
export function markImage(rawInitials: string, px: number, opts: { rounded?: boolean } = {}) {
  const initials = rawInitials.normalize("NFC");
  const two = initials.length > 1;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND.rose,
          borderRadius: opts.rounded ? "50%" : 0,
          color: BRAND.bg,
          fontFamily: "Cormorant",
          fontWeight: 500,
          fontSize: px * (two ? 0.5 : 0.66),
          letterSpacing: two ? -px * 0.01 : 0,
          // nhích chữ lên một chút vì font serif có phần đuôi dưới
          paddingBottom: px * 0.05,
        }}
      >
        {initials}
      </div>
    ),
    { width: px, height: px, fonts: ogFonts },
  );
}

type CardInput = {
  initials: string;
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
  const initials = input.initials.normalize("NFC");
  const eyebrow = input.eyebrow.normalize("NFC");
  const title = input.title.normalize("NFC");
  const subtitle = nfc(input.subtitle);
  const footer = nfc(input.footer);
  const img = await toDataUri(input.imageUrl, 800);
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
          fontFamily: "Cormorant",
          color: BRAND.ink,
          padding: "64px 72px",
        }}
      >
        {/* Cột chữ */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between", paddingRight: img ? 48 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `1.5px solid ${BRAND.rose}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: BRAND.rose,
                fontSize: initials.length > 1 ? 28 : 34,
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              {initials}
            </div>
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
    { width: 1200, height: 630, fonts: ogFonts },
  );
}
