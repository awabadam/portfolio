import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Clinic websites that bring international patients",
    "Multilingual clinic sites with lead tracking, built in Istanbul."
  );
}
