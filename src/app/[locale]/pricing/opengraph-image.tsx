import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Clinic website pricing, fixed in USD",
    "Two packages and two care plans. No hidden fees."
  );
}
