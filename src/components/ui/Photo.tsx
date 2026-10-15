import Image from "next/image";
import clsx from "clsx";
import { img as getImg } from "@/content/images";

type Props = {
  id: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** "cover" fills the frame; "natural" keeps the photo's own aspect ratio. */
  fit?: "cover" | "natural";
  objectPosition?: string;
  alt?: string;
};

/** Thin wrapper around next/image driven by the image manifest. */
export function Photo({ id, className, imgClassName, sizes = "100vw", priority, fit = "cover", objectPosition, alt }: Props) {
  const image = getImg(id);
  if (fit === "natural") {
    return (
      <Image
        src={image.src}
        alt={alt ?? image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className={clsx("h-auto w-full", className, imgClassName)}
      />
    );
  }
  return (
    <div className={clsx("relative overflow-hidden bg-charcoal/10", className)}>
      <Image
        src={image.src}
        alt={alt ?? image.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className={clsx("object-cover", imgClassName)}
        style={{ objectPosition: objectPosition ?? image.position }}
      />
    </div>
  );
}
