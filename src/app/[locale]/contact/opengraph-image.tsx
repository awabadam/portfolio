import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Get in Touch",
    "Let's build something amazing together"
  );
}
