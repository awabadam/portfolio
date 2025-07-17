import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import {
  trackSocialClick,
  trackContactClick,
  trackNavigationClick,
} from "@/lib/gtm";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="mb-4 text-lg font-bold">Awab Elkhalil</h3>
            <p className="mb-4 text-muted-foreground">
              Professional web designer and developer based in Istanbul,
              specializing in creating modern, conversion-focused websites for
              healthcare businesses and startups.
            </p>
            <div className="flex gap-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                onClick={() => trackContactClick("email", "footer")}
              >
                <Link href="mailto:awabe.adam@gmail.com">
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                onClick={() => trackContactClick("phone", "footer")}
              >
                <Link href="tel:+905541759945">
                  <Phone className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                onClick={() => trackSocialClick("github", "footer")}
              >
                <Link
                  href="https://github.com/awabelkhalil"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                onClick={() => trackSocialClick("linkedin", "footer")}
              >
                <Link
                  href="https://linkedin.com/in/awabelkhalil"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                About Me
              </Link>
              <Link
                href="/projects"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Portfolio
              </Link>
              <Link
                href="#services"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Services
              </Link>
              <Link
                href="#contact"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 font-semibold">Contact Info</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Istanbul, Turkey</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:awabe.adam@gmail.com"
                  className="hover:text-primary"
                >
                  awabe.adam@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+905541759945" className="hover:text-primary">
                  +90 554 175 9945
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Awab Elkhalil. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with Next.js, TypeScript & Tailwind CSS
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              onClick={() => trackContactClick("whatsapp", "footer")}
            >
              <Link
                href="https://wa.me/905541759945"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Quote
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              onClick={() => trackNavigationClick("view_work", "footer")}
            >
              <Link href="/projects">View Work</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
