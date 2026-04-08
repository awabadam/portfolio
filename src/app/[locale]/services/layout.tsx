import Breadcrumbs from "@/components/seo/Breadcrumbs";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
      ]} />
      {children}
    </>
  );
}
