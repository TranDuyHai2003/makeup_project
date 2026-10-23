import { Reveal } from "./Reveal";

type Props = { eyebrow: string; title: string; description?: string; align?: "left" | "center" };

export function SectionHeading({ eyebrow, title, description, align = "center" }: Props) {
  const center = align === "center";
  return (
    <Reveal className={center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display text-4xl md:text-5xl font-light mt-4 leading-tight">{title}</h2>
      <div className={`gold-line w-24 mt-6 ${center ? "mx-auto" : ""}`} />
      {description && <p className="text-muted mt-6 leading-relaxed">{description}</p>}
    </Reveal>
  );
}
