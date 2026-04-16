import React from "react";
import Image from "next/image";

const sections = [
  {
    heading: "🎨 Clear & Simple Solutions",
    content:
      "I focus on originality and simplicity, crafting designs that meet your unique needs, from logos to user-friendly websites.",
  },
  {
    heading: "💻 Modern Web Design Expertise",
    content:
      "With skills in Tailwind CSS and Next.js, I create sleek websites and landing pages that drive results and engage users.",
  },
  {
    heading: "🤝 Let's Collaborate",
    content:
      "Looking for a creative partner? Let’s team up to bring your vision to life and make it a success!",
  },
];

const Header = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center p-8 pt-32 md:flex-row">
        <div className="flex flex-col justify-end p-8 md:h-[40vh] md:w-1/2 md:p-12">
          <h1 className="text-4xl md:text-8xl">👋 Hi, I'm Awab!</h1>
          <p className="mt-8 md:text-2xl">
            I'm a Graphic and Web Designer who creates visually captivating and
            innovative designs. My goal is to turn ideas into impactful digital
            experiences.
          </p>
        </div>
        <Image
          className="md:w-[450px]"
          src="/img/hero-image.jpg"
          alt="Awab Elkhalil — Web Designer & Developer"
          width={300}
          height={30}
        />
      </div>

      <div className="z-50 flex flex-row items-baseline justify-center gap-4 p-8 text-xs font-semibold tracking-wider text-neutral-600 md:text-base">
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

      <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-3 md:p-24 md:pt-0">
        {sections.map((section, key) => (
          <div className="rounded-xl border border-neutral-800 p-12" key={key}>
            <h2 className="text-2xl font-bold">{section.heading}</h2>
            <p className="mt-4">{section.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Header;
