import { generateOGImage, size, contentType } from "@/lib/og-image";
import { getProjectById } from "@/data/projects";
import { getCaseStudy } from "@/data/case-studies";

export { size, contentType };

export default async function Image({ params }: { params: Promise<{ project: string }> }) {
  const { project: slug } = await params;
  const project = await getProjectById(slug);
  const study = project ? getCaseStudy(project.id) : undefined;
  const title = project ? project.title : "Clinic website case study";
  const subtitle = study?.headline ?? project?.description ?? "Web design from Istanbul";
  return generateOGImage(title, subtitle.slice(0, 140));
}
