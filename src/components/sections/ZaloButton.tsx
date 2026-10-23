import { zaloLink } from "@/lib/utils";

export function ZaloButton({ zalo }: { zalo: string | null }) {
  const href = zaloLink(zalo);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Nhắn Zalo"
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0068ff] text-white shadow-lg shadow-black/40 transition-transform hover:scale-105"
    >
      <span className="text-[0.7rem] font-semibold tracking-wide">Zalo</span>
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#0068ff]/40" />
    </a>
  );
}
