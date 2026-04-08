import Breadcrumbs from "@/components/seo/Breadcrumbs";

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
      ]} />
      {children}
    </>
  );
}
