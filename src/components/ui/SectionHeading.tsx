import clsx from "clsx";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, lede, align = "left", tone = "dark", className, as: H = "h2" }: Props) {
  return (
    <Reveal className={clsx(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && (
        <p data-reveal className={clsx("eyebrow mb-5", tone === "dark" ? "text-gold-deep" : "text-gold", align === "center" && "justify-center")}>
          {eyebrow}
        </p>
      )}
      <H data-reveal className={clsx("display-lg", tone === "dark" ? "text-charcoal" : "text-ivory")}>
        {title}
      </H>
      {lede && (
        <div data-reveal className={clsx("lede mt-6", tone === "dark" ? "text-charcoal/75" : "text-ivory/80")}>
          {lede}
        </div>
      )}
    </Reveal>
  );
}
