"use client";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-[10vw] py-8 md:px-24">
      <a className="font-bold" href="">
        Awab Elkhalil
      </a>

      <a className="border border-neutral-800 p-4 dark:border-white" href="">
        Let's work together
      </a>
    </nav>
  );
};

export default Navbar;
