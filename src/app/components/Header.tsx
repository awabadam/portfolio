import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-4 p-8 px-24 pt-32">
      <div className="flex flex-col items-center justify-center md:flex-row">
        <div className="text-center md:w-[50vw]">
          <h1 className="my-8 text-center text-6xl font-black uppercase md:my-0 lg:text-8xl">
            Visual & Graphic Designer
          </h1>
          <p className="md:mt-8">
            I Design Websites and Meta Ads for Small businesses
          </p>
        </div>
        <Image
          className="md:w-[450px]"
          src="/img/awab_hero.webp"
          alt="hero-img"
          width={300}
          height={30}
        />
      </div>

      <div className="z-50 flex flex-row items-baseline justify-center gap-4 text-xs font-semibold tracking-wider text-neutral-600 md:text-base">
        <div className="flex gap-2 hover:text-neutral-800 dark:hover:text-white">
          <p className="">Istanbul</p>
          <p>GMT+3</p>
        </div>
        <hr className="w-auto border border-neutral-900 md:w-[65vw]" />
        <div className="">
          <ul className="flex gap-2">
            <li>
              <a
                href="https://www.linkedin.com/in/awab-adam/"
                className="hover:text-neutral-800 dark:hover:text-white"
              >
                Linkedin
              </a>
            </li>
            <li>
              <a
                href="https://www.behance.net/awab-elkhalil"
                className="hover:text-neutral-800 dark:hover:text-white"
              >
                Behance
              </a>
            </li>

            <li>
              <a
                href="https://www.instagram.com/awabeladam/"
                className="hover:text-neutral-800 dark:hover:text-white"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Header;
