import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Talk to a clinic web designer in Istanbul",
    "Reply within one business day. No sales calls."
  );
}
