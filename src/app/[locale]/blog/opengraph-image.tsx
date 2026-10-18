import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Notes on clinic websites and patient leads",
    "Practical writing on medical tourism SEO and multilingual sites."
  );
}
