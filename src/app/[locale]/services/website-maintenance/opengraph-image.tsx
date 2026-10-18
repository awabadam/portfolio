import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "Clinic website hosting and care plans",
    "Monthly updates, backups and a lead report, from Istanbul."
  );
}
