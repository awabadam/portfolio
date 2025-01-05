import React from "react";

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

const page = () => {
  return (
    <main className="items-left flex h-full min-h-screen w-screen flex-col justify-end gap-4 p-8 pt-32 md:px-24">
      <div className="flex h-[60vh] flex-col justify-end p-8 md:h-[40vh] md:p-12">
        <h1 className="text-4xl md:text-8xl">👋 Hi, I'm Awab!</h1>
        <p className="mt-8">
          I'm a Graphic and Web Designer who creates visually captivating and
          innovative designs. My goal is to turn ideas into impactful digital
          experiences.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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

export default page;
