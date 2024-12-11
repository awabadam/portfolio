"use client";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <nav className="relative z-50 flex w-full items-center justify-between">
      <a className="font-bold" href="">
        Awab Elkhalil
      </a>

      <a className="border p-4" href="">
        Let's work together
      </a>
    </nav>
  );
};

export default Navbar;
