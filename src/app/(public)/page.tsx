import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { JsonLd } from "@/components/sections/JsonLd";
import { Portfolio } from "@/components/sections/Portfolio";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { getSiteData } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const title = `${settings.artist_name ?? "Makeup Artist"} · Makeup Artist`;
  const description = settings.tagline ?? "Portfolio makeup artist chuyên nghiệp.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: settings.hero_url ? [{ url: settings.hero_url }] : undefined },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HomePage() {
  const data = await getSiteData();
  return (
    <>
      <JsonLd settings={data.settings} />
      <Hero settings={data.settings} />
      <About settings={data.settings} />
      <Services services={data.services} />
      <Portfolio photos={data.photos} categories={data.categories} />
      <BeforeAfter photos={data.photos} />
      <Testimonials testimonials={data.testimonials} />
      <Contact settings={data.settings} />
    </>
  );
}
