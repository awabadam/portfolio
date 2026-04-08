import Breadcrumbs from "@/components/seo/Breadcrumbs";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
      ]} />
      {children}
    </>
  );
}
