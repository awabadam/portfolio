import Link from "next/link";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Awab Elkhalil. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link
              href="https://wa.me/905541759945"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects">Work</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
