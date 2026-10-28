import "server-only";
import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/data";
import { isLocale, type Locale } from "./config";
import { localizeSiteData } from "./content";
import { getDictionary } from "./index";

/** Đọc ngôn ngữ từ params của route [lang]; sai → trang 404. */
export async function resolveLang(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

/** Dữ liệu trang (đã cache chung) + bản dịch theo ngôn ngữ + từ điển giao diện. */
export async function getLocalized(lang: Locale) {
  const data = localizeSiteData(await getSiteData(), lang);
  return { data, t: getDictionary(lang) };
}
