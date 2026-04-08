import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Web Design & Development Services",
    "Modern websites, UI/UX, SEO, chatbots, and more"
  );
}
