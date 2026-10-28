import { SITE_URL } from "@/lib/env";
import { LOCALE_META, localePath, type Locale } from "@/lib/i18n/config";
import type { Settings } from "@/lib/types";

export function JsonLd({ settings, lang }: { settings: Settings; lang: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: settings.artist_name,
    description: settings.tagline,
    url: `${SITE_URL}${localePath(lang, "/") === "/" ? "" : localePath(lang, "/")}`,
    inLanguage: LOCALE_META[lang].htmlLang,
    image: settings.hero_url ?? undefined,
    telephone: settings.phone ?? undefined,
    address: settings.address ? { "@type": "PostalAddress", streetAddress: settings.address, addressCountry: "VN" } : undefined,
    sameAs: [settings.facebook, settings.instagram, settings.tiktok].filter(Boolean),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
