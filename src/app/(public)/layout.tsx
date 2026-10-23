import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { ZaloButton } from "@/components/sections/ZaloButton";
import { getSiteData } from "@/lib/data";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getSiteData();
  return (
    <>
      <Header name={settings.artist_name ?? "Portfolio"} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <ZaloButton zalo={settings.zalo} />
    </>
  );
}
