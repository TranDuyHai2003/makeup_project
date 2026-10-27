import type { Metadata } from "next";
import { brandName } from "@/lib/brand";
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
  const { settings, categories } = await getSiteData();
  const name = brandName(settings.artist_name);
  const area = settings.address ? ` tại ${settings.address}` : "";
  // Tiêu đề trang chủ: tên + dịch vụ chính + khu vực (từ khoá khách hay tìm), không lặp lại template
  const title = `${name} · Makeup cô dâu & sự kiện${area}`;
  const services = categories.map((c) => c.name.toLowerCase()).join(", ");
  const tagline = settings.tagline?.trim().replace(/([^.!?…])$/, "$1.");
  const description = [tagline, services && `Nhận makeup ${services}${area}.`].filter(Boolean).join(" ");
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: "/" },
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
