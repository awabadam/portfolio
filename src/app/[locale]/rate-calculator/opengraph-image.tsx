import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Instant Quote",
    "Pick what you need, see the price — no surprises"
  );
}
