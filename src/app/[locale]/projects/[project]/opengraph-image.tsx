import { generateOGImage, size, contentType } from "@/lib/og-image";
import { getProjectById } from "@/data/projects";
import { getCaseStudy } from "@/data/case-studies";
import { getBrandStudy } from "@/data/brand-studies";

export { size, contentType };

export default async function Image({ params }: { params: Promise<{ project: string }> }) {
  const { project: slug } = await params;
  const project = await getProjectById(slug);
  const study = project ? getCaseStudy(project.id) : undefined;
  const brand = getBrandStudy(slug);
  const title = project?.title ?? brand?.client ?? "Clinic website case study";
  const subtitle =
    brand?.headline ??
    study?.headline ??
    project?.description ??
    "Web design from Istanbul";
  return generateOGImage(title, subtitle.slice(0, 140));
}
