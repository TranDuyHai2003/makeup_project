import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Portfolio } from "@/components/sections/Portfolio";
import { getCategoryBySlug, getSiteData } from "@/lib/data";

type Props = PageProps<"/portfolio/[category]">;

export async function generateStaticParams() {
  const { categories } = await getSiteData();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const data = await getCategoryBySlug(category);
  if (!data.category) return { title: "Không tìm thấy" };
  const title = `Makeup ${data.category.name} · ${data.settings.artist_name}`;
  return {
    title,
    description: `Album makeup ${data.category.name.toLowerCase()} của ${data.settings.artist_name}.`,
    openGraph: { title, images: data.photos[0] ? [{ url: data.photos[0].url }] : undefined },
  };
}

/**
 * Các slug trong generateStaticParams được prerender tĩnh. Slug mới (tạo trong admin sau khi deploy)
 * được render lần đầu khi có người truy cập rồi cache lại. Slug không tồn tại hiển thị trang 404.
 */
export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const data = await getCategoryBySlug(category);
  if (!data.category) notFound();

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Link href="/#portfolio" className="text-[0.7rem] uppercase tracking-[0.25em] text-muted hover:text-gold">← Về trang chủ</Link>
      </div>
      <Portfolio photos={data.photos} categories={data.categories} showFilter={false} eyebrow="Album" title={`Makeup ${data.category.name}`} />
      {data.photos.length === 0 && <p className="pb-24 text-center text-muted">Album này chưa có ảnh.</p>}
    </div>
  );
}
