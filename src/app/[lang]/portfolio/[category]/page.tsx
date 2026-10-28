import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Portfolio } from "@/components/sections/Portfolio";
import { getSiteData } from "@/lib/data";
import { languageAlternates, LOCALE_META, localePath } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/format";
import { getLocalized, resolveLang } from "@/lib/i18n/server";

type Props = PageProps<"/[lang]/portfolio/[category]">;

export async function generateStaticParams() {
  const { categories } = await getSiteData();
  return categories.map((c) => ({ category: c.slug }));
}

async function load(params: Props["params"]) {
  const lang = await resolveLang(params);
  const { category } = await params;
  const { data, t } = await getLocalized(lang);
  const cat = data.categories.find((c) => c.slug === category) ?? null;
  const photos = cat ? data.photos.filter((p) => p.category_id === cat.id) : [];
  return { lang, t, data, cat, photos };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t, data, cat, photos } = await load(params);
  if (!cat) return { title: t.meta.notFound, robots: { index: false } };
  const artist = data.settings.artist_name ?? "Makeup Artist";
  const area = data.settings.address?.trim();
  const catName = lang === "zh-TW" ? cat.name : cat.name.toLowerCase();
  const title = fmt(t.meta.albumTitle, { name: cat.name });
  const description = fmt(area ? t.meta.albumDescriptionArea : t.meta.albumDescription, { n: photos.length, name: catName, artist, area });
  const path = `/portfolio/${cat.slug}`;
  return {
    title, // template của layout tự thêm " · <tên thương hiệu>"
    description,
    alternates: { canonical: localePath(lang, path), languages: languageAlternates(path) },
    openGraph: { title: `${title} · ${artist}`, description, url: localePath(lang, path), locale: LOCALE_META[lang].ogLocale },
    twitter: { card: "summary_large_image", title: `${title} · ${artist}`, description },
  };
}

/**
 * Các slug trong generateStaticParams được prerender tĩnh (cho cả 3 ngôn ngữ). Slug mới tạo trong admin
 * được render lần đầu khi có người truy cập rồi cache lại. Slug không tồn tại hiển thị trang 404.
 */
export default async function CategoryPage({ params }: Props) {
  const { lang, t, data, cat, photos } = await load(params);
  if (!cat) notFound();

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Link href={localePath(lang, "/#portfolio")} className="text-[0.7rem] uppercase tracking-[0.25em] text-muted hover:text-gold">{t.portfolio.backHome}</Link>
      </div>
      <Portfolio
        photos={photos}
        categories={data.categories}
        lang={lang}
        t={t.portfolio}
        showFilter={false}
        eyebrow={t.portfolio.albumEyebrow}
        title={fmt(t.portfolio.albumTitle, { name: cat.name })}
      />
      {photos.length === 0 && <p className="pb-24 text-center text-muted">{t.portfolio.albumEmpty}</p>}
    </div>
  );
}
