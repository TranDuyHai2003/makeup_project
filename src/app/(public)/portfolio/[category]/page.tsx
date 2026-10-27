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
  if (!data.category) return { title: "Không tìm thấy", robots: { index: false } };
  const name = data.settings.artist_name ?? "Makeup Artist";
  const title = `Album makeup ${data.category.name}`;
  const description = `${data.photos.length} ảnh makeup ${data.category.name.toLowerCase()} của ${name}${data.settings.address ? ` tại ${data.settings.address}` : ""}.`;
  return {
    title, // template gốc tự thêm " · <tên thương hiệu>"
    description,
    alternates: { canonical: `/portfolio/${data.category.slug}` },
    openGraph: { title: `${title} · ${name}`, description, url: `/portfolio/${data.category.slug}` },
    twitter: { card: "summary_large_image", title: `${title} · ${name}`, description },
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
