import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Websites that bring international patients to your clinic",
    "Multilingual clinic sites with lead tracking to your CRM and Google Ads. Istanbul."
  );
}
