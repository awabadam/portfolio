import { generateOGImage, size, contentType } from "@/lib/og-image";

export { size, contentType };

export default function Image() {
  return generateOGImage(
    "The 3 things on your website costing you international patients",
    "Free 2-minute check. A quick site scan, about 10 quick questions, your score and the 3 fixes that bring more inquiries."
  );
}
