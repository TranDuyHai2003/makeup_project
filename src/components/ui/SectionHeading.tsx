import { Reveal } from "./Reveal";

type Props = { eyebrow: string; title: string; description?: string; align?: "left" | "center" };

export function SectionHeading({ eyebrow, title, description, align = "center" }: Props) {
  const center = align === "center";
  return (
    <Reveal className={center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display text-balance mt-4 text-[2.4rem] font-light leading-[1.1] md:text-[3.4rem]">{title}</h2>
      <div className={`gold-line w-24 mt-6 ${center ? "mx-auto" : ""}`} />
      {description && <p className="text-balance mt-6 text-[0.95rem] leading-relaxed text-muted md:text-base">{description}</p>}
    </Reveal>
  );
}
