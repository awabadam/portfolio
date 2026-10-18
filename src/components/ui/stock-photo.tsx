import Image from "next/image";
import { IMAGE_CREDITS } from "@/data/image-credits";
import { cn } from "@/lib/utils";

type StockPhotoProps = {
  /** Basename in /public/img/stock (key of IMAGE_CREDITS). */
  slot: keyof typeof IMAGE_CREDITS;
  /** Classes for the sized frame (set the aspect ratio or height here). */
  className?: string;
  /** Classes for the <img> itself (object-position, opacity…). */
  imageClassName?: string;
  /**
   * Rendered width of the IMAGE, not the frame. With object-cover, a photo
   * wider than its frame renders at frame height x photo aspect, so size for
   * that or the browser downloads a too-small file and upscales it.
   */
  sizes: string;
  priority?: boolean;
  /** next/image quality; 85 by default (must be listed in next.config images.qualities). */
  quality?: 75 | 85 | 90;
  /** Purely decorative: empty alt + aria-hidden. */
  decorative?: boolean;
  children?: React.ReactNode;
};

/**
 * Stock photo in the site's standard frame (rounded 10px, muted fill while
 * loading). Alt text comes from src/data/image-credits.ts. The frame must
 * get its size from `className` (e.g. `aspect-[4/3]`), since the image fills it.
 */
export default function StockPhoto({
  slot,
  className,
  imageClassName,
  sizes,
  priority,
  quality = 85,
  decorative,
  children,
}: StockPhotoProps) {
  const credit = IMAGE_CREDITS[slot];
  return (
    <div
      className={cn("relative overflow-hidden rounded-[10px] bg-muted", className)}
      aria-hidden={decorative || undefined}
    >
      <Image
        src={credit.src}
        alt={decorative ? "" : credit.alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
      {children}
    </div>
  );
}
