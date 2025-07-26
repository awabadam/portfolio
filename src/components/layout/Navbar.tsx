"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { trackNavigationClick, trackContactClick } from "@/lib/gtm";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link className="text-lg font-bold md:text-xl" href="/">
          Awab Elkhalil
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  href="/about"
                  legacyBehavior
                  passHref
                  onClick={() => trackNavigationClick("about", "navbar")}
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/projects"
                  legacyBehavior
                  passHref
                  onClick={() => trackNavigationClick("work", "navbar")}
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Work
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/blog"
                  legacyBehavior
                  passHref
                  onClick={() => trackNavigationClick("blog", "navbar")}
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button
            asChild
            variant="outline"
            onClick={() => trackContactClick("whatsapp", "navbar")}
          >
            <Link
              href="https://wa.me/905541759945"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reach out
            </Link>
          </Button>

          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 py-4">
                <SheetClose asChild>
                  <Link
                    href="/about"
                    className="flex w-full items-center py-2 text-lg font-medium"
                  >
                    About
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/projects"
                    className="flex w-full items-center py-2 text-lg font-medium"
                  >
                    Work
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/blog"
                    className="flex w-full items-center py-2 text-lg font-medium"
                  >
                    Blog
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="https://wa.me/905541759945"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center py-2 text-lg font-medium"
                  >
                    Reach out
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
