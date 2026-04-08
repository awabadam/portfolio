import Breadcrumbs from "@/components/seo/Breadcrumbs";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Projects", url: "/projects" },
      ]} />
      {children}
    </>
  );
}
