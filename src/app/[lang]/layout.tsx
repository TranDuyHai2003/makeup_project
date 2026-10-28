import type { Metadata } from "next";
import { ContactBar } from "@/components/sections/ContactBar";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { brandName } from "@/lib/brand";
import { LOCALE_META, LOCALES, languageAlternates } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/format";
import { getLocalized, resolveLang } from "@/lib/i18n/server";

/** Tạo sẵn trang tĩnh cho cả 3 ngôn ngữ lúc build. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { data, t } = await getLocalized(lang);
  const name = brandName(data.settings.artist_name);
  return {
    title: { default: fmt(t.meta.siteTitle, { name }), template: `%s · ${name}` },
    description: data.settings.tagline ?? t.meta.defaultDescription,
    alternates: { languages: languageAlternates("/") },
    openGraph: { siteName: name, locale: LOCALE_META[lang].ogLocale, alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => LOCALE_META[l].ogLocale), type: "website" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = await resolveLang(params);
  const { data, t } = await getLocalized(lang);
  const { settings } = data;
  return (
    // lang trên khung trang giúp trình duyệt chọn đúng font chữ Hán phồn thể và trình đọc màn hình đọc đúng giọng
    <div lang={LOCALE_META[lang].htmlLang} className="flex min-h-full flex-1 flex-col">
      {lang === "zh-TW" && (
        // Font chữ Hán phồn thể chỉ nạp ở trang tiếng Trung (Google Fonts chia nhỏ theo unicode-range, chỉ tải chữ cần dùng).
        // Không dùng next/font cho font CJK vì Turbopack build lỗi với font chia nhiều mảnh.
        <>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          {/* eslint-disable-next-line @next/next/no-page-custom-font -- cố ý chỉ nạp ở trang tiếng Trung */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500&family=Noto+Serif+TC:wght@300;400&display=swap"
            precedence="default"
          />
        </>
      )}
      <Header name={settings.artist_name ?? "Portfolio"} lang={lang} t={t.nav} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} lang={lang} t={t} />
      <ContactBar settings={settings} t={t.contactBar} />
    </div>
  );
}
