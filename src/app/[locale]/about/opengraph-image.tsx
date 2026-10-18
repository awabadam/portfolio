import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Awab Elkhalil, clinic web designer in Istanbul",
    "Websites for dental, aesthetic and hair transplant clinics."
  );
}
