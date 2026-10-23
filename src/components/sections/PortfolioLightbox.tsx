"use client";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { cldSrcSet, cldUrl } from "@/lib/cloudinary";
import type { Photo } from "@/lib/types";

/** Tách riêng để chỉ tải thư viện lightbox khi khách bấm vào ảnh lần đầu. */
export default function PortfolioLightbox({ photos, index, onClose }: { photos: Photo[]; index: number; onClose: () => void }) {
  return (
    <Lightbox
      open={index >= 0}
      index={Math.max(index, 0)}
      close={onClose}
      plugins={[Captions, Counter, Zoom]}
      captions={{ descriptionTextAlign: "center", showToggle: false }}
      counter={{ container: { style: { top: "unset", bottom: 0, left: "50%", transform: "translateX(-50%)", fontSize: "0.75rem", letterSpacing: "0.2em" } } }}
      zoom={{ maxZoomPixelRatio: 2.5, scrollToZoom: true }}
      carousel={{ finite: photos.length <= 2, preload: 2 }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      slides={photos.map((p) => {
        const srcSet = cldSrcSet(p.url, 1920);
        return {
          src: cldUrl(p.url, 1920),
          alt: p.caption ?? "",
          title: p.caption ?? undefined,
          width: p.width ?? undefined,
          height: p.height ?? undefined,
          srcSet: srcSet && p.width && p.height
            ? [640, 1024, 1600, 1920].map((w) => ({ src: cldUrl(p.url, w), width: w, height: Math.round((w * p.height!) / p.width!) }))
            : undefined,
        };
      })}
      styles={{
        container: { backgroundColor: "rgba(8,8,9,0.97)" },
        captionsTitleContainer: { background: "linear-gradient(to bottom, rgba(0,0,0,.6), transparent)" },
        captionsTitle: { fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "1.4rem", textAlign: "center" },
      }}
    />
  );
}
