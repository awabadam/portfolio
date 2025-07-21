"use client";

import Link from "next/link";
import { useState, useEffect, MouseEvent } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".nav-menu") && !target.closest(".menu-button")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-white px-6 py-4 dark:bg-black dark:bg-gradient-to-b dark:from-black dark:via-black/90 dark:to-transparent md:px-[10vw] md:py-6 lg:px-24">
      <Link className="text-lg font-bold md:text-xl" href="/">
        Awab Elkhalil
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden gap-x-3 md:flex">
        <Link
          className="flex items-center justify-center rounded-md border-2 border-neutral-800 px-4 py-1.5 text-sm transition-all duration-300 hover:scale-105 hover:border-neutral-300 dark:border-neutral-600 md:py-2 md:text-base"
          href="/projects"
        >
          Work
        </Link>
        <Link
          className="flex items-center justify-center rounded-md border-2 border-neutral-800 px-4 py-1.5 text-sm transition-all duration-300 hover:scale-105 hover:border-neutral-300 dark:border-neutral-600 md:py-2 md:text-base"
          href="/rate-calculator"
        >
          Pricing
        </Link>
        <Link
          className="flex items-center justify-center rounded-md border-2 border-neutral-800 px-4 py-1.5 text-sm transition-all duration-300 hover:scale-105 hover:border-neutral-300 dark:border-neutral-600 md:py-2 md:text-base"
          href="https://wa.me/905541759945"
          target="_blank"
          rel="noopener noreferrer"
        >
          Reach out
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="menu-button p-2 dark:text-white md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="nav-menu fixed left-0 top-16 z-50 w-full bg-white/95 backdrop-blur-md dark:bg-black/95 md:hidden">
          <div className="flex flex-col items-center gap-y-4 p-6">
            <Link
              className="w-full rounded-md border-2 border-neutral-800 px-6 py-3 text-center transition-all duration-300 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-900"
              href="/projects"
              onClick={() => setIsOpen(false)}
            >
              Work
            </Link>
            <Link
              className="w-full rounded-md border-2 border-neutral-800 px-6 py-3 text-center transition-all duration-300 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-900"
              href="/rate-calculator"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              className="w-full rounded-md border-2 border-neutral-800 px-6 py-3 text-center transition-all duration-300 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-900"
              href="https://wa.me/905541759945"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              Reach out
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
