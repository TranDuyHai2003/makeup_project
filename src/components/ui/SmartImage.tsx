"use client";
import { useEffect, useRef, useState } from "react";
import { cldBlurUrl, cldSrcSet, cldUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  sizes?: string;
  maxWidth?: number;
  priority?: boolean;
  /** Phủ kín phần tử cha (cha cần position: relative). */
  fill?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * Ảnh tối ưu: với Cloudinary tự sinh srcset + placeholder mờ; ảnh khác dùng nguyên URL.
 * Giữ width/height để layout không nhảy khi tải.
 */
export function SmartImage({ src, alt, width, height, sizes = "100vw", maxWidth = 1600, priority, fill, className, imgClassName }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Ảnh eager (hero, avatar) có thể tải xong TRƯỚC khi React hydrate, khi đó onLoad không bao giờ chạy.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete) {
      setLoaded(true);
      if (img.naturalWidth === 0) setFailed(true);
    }
  }, []);
  const blur = cldBlurUrl(src);
  const ratio = width && height ? `${width} / ${height}` : undefined;

  return (
    <div
      className={cn(fill ? "absolute inset-0" : "relative", "overflow-hidden bg-bg-2", className)}
      style={{
        aspectRatio: ratio,
        backgroundImage: blur && !loaded ? `url(${blur})` : undefined,
        backgroundSize: "cover",
      }}
    >
      {failed ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a2320] via-bg-2 to-[#1b1a16]" aria-hidden />
      ) : (
        <img
          ref={ref}
          src={cldUrl(src, maxWidth)}
          srcSet={cldSrcSet(src, maxWidth)}
          sizes={sizes}
          alt={alt}
          width={width ?? undefined}
          height={height ?? undefined}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover transition-all duration-700",
            loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
