"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaBehance } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full border-t border-neutral-800 bg-white dark:border-neutral-600 dark:bg-black">
      <div className="mx-auto flex flex-col items-center justify-between gap-6 px-[10vw] py-8 md:flex-row md:px-24 lg:px-32">
        {/* Copyright */}
        <div className="text-center md:text-left">
          <p className="text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} Awab Elkhalil
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-x-4">
          <Link
            href="https://github.com/awabadam"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-800 text-neutral-800 transition-all duration-300 hover:scale-105 hover:border-neutral-300 hover:text-neutral-300 dark:border-neutral-400 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
          >
            <FaGithub size={20} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/awab-adam/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-800 text-neutral-800 transition-all duration-300 hover:scale-105 hover:border-neutral-300 hover:text-neutral-300 dark:border-neutral-400 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
          >
            <FaLinkedin size={20} />
          </Link>
          <Link
            href="https://www.behance.net/awab-elkhalil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-800 text-neutral-800 transition-all duration-300 hover:scale-105 hover:border-neutral-300 hover:text-neutral-300 dark:border-neutral-400 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
          >
            <FaBehance size={20} />
          </Link>
        </div>

        {/* Additional Links */}
        <div className="flex gap-x-6">
          <Link
            href="/privacy"
            className="text-neutral-600 transition-all duration-300 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-neutral-600 transition-all duration-300 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
