import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { JsonLd } from "@/components/sections/JsonLd";
import { Portfolio } from "@/components/sections/Portfolio";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { brandName } from "@/lib/brand";
import { languageAlternates, LOCALE_META, localePath } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/format";
import { getLocalized, resolveLang } from "@/lib/i18n/server";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { data, t } = await getLocalized(lang);
  const { settings, categories } = data;
  const name = brandName(settings.artist_name);
  const area = settings.address?.trim();
  // Tiêu đề trang chủ: tên + dịch vụ chính + khu vực (từ khoá khách hay tìm)
  const title = fmt(area ? t.meta.homeTitleArea : t.meta.homeTitle, { name, area });
  const services = categories.map((c) => c.name.toLowerCase()).join(lang === "zh-TW" ? "、" : ", ");
  const tagline = settings.tagline?.trim().replace(/([^.!?…。！？])$/, lang === "zh-TW" ? "$1。" : "$1.");
  const servicesLine = services ? fmt(area ? t.meta.homeServicesArea : t.meta.homeServices, { services, area }) : "";
  const description = [tagline, servicesLine].filter(Boolean).join(lang === "zh-TW" ? "" : " ");
  const url = localePath(lang, "/");
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: languageAlternates("/") },
    openGraph: { title, description, url, locale: LOCALE_META[lang].ogLocale },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const lang = await resolveLang(params);
  const { data, t } = await getLocalized(lang);
  return (
    <>
      <JsonLd settings={data.settings} lang={lang} />
      <Hero settings={data.settings} lang={lang} t={t.hero} />
      <About settings={data.settings} t={t.about} />
      <Services services={data.services} lang={lang} t={t} />
      <Portfolio photos={data.photos} categories={data.categories} lang={lang} t={t.portfolio} />
      <BeforeAfter photos={data.photos} t={t.beforeAfter} />
      <Testimonials testimonials={data.testimonials} t={t.testimonials} />
      <Contact settings={data.settings} lang={lang} t={t.contact} />
    </>
  );
}
