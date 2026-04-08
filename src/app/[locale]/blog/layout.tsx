import Breadcrumbs from "@/components/seo/Breadcrumbs";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
      ]} />
      {children}
    </>
  );
}
