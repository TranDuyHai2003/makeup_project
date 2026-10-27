import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import { brandName } from "@/lib/brand";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/**
 * Metadata chung: tên thương hiệu lấy từ admin nên tự gắn vào mọi tiêu đề trang ("Album Cô dâu · Trà My Makeup").
 * Favicon, icon iPhone, ảnh chia sẻ được sinh tự động: xem app/icon.tsx, app/apple-icon.tsx, app/(public)/opengraph-image.tsx.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const name = brandName(settings.artist_name);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${name} · Makeup Artist`, template: `%s · ${name}` },
    description: settings.tagline ?? "Portfolio makeup artist chuyên nghiệp: cô dâu, sự kiện, editorial, kỷ yếu.",
    applicationName: name,
    authors: [{ name }],
    creator: name,
    appleWebApp: { capable: true, title: name, statusBarStyle: "default" },
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: { siteName: name, locale: "vi_VN", type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#fcf6f4",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${beVietnam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
