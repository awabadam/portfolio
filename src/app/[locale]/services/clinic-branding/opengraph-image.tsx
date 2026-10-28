import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Clinic branding",
    "Logo, before-and-after templates and a WhatsApp kit for your coordinators."
  );
}
