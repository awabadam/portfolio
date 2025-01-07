"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-gradient-to-b from-black via-black/90 to-transparent px-[10vw] py-8 md:px-24">
      <Link className="font-bold" href="/">
        Awab Elkhalil
      </Link>

      <Link
        className="border border-neutral-800 p-4 dark:border-white"
        href="https://wa.me/905541759945"
      >
        Let's work together
      </Link>
    </nav>
  );
};

export default Navbar;
