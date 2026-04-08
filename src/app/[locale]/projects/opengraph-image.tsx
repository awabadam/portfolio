import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Portfolio — Selected Works",
    "Web design and development projects"
  );
}
