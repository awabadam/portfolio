import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Clinic website case studies from Istanbul",
    "Dental, aesthetic and hair transplant clinic sites, with results."
  );
}
