import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Web design in Istanbul for clinics",
    "Multilingual sites that turn visitors into patient enquiries."
  );
}
