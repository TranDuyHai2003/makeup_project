import { SITE_URL } from "@/lib/env";
import type { Settings } from "@/lib/types";

export function JsonLd({ settings }: { settings: Settings }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: settings.artist_name,
    description: settings.tagline,
    url: SITE_URL,
    image: settings.hero_url ?? undefined,
    telephone: settings.phone ?? undefined,
    address: settings.address ? { "@type": "PostalAddress", streetAddress: settings.address, addressCountry: "VN" } : undefined,
    sameAs: [settings.facebook, settings.instagram, settings.tiktok].filter(Boolean),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
