import React from "react";

const projects = [
  "https://www.behance.net/embed/project/104684137?ilo0=1",
  "https://www.behance.net/embed/project/125053859?ilo0=1",
  "https://www.behance.net/embed/project/124152191?ilo0=1",
  "https://www.behance.net/embed/project/124161365?ilo0=1",
  "https://www.behance.net/embed/project/104690015?ilo0=1",
];

const Projects = () => {
  return (
    <main className="flex h-fit w-full flex-col items-center justify-center gap-4 p-8 md:px-24">
      <h1 className="my-20 text-4xl uppercase">Projects</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {projects.map((index) => (
          <iframe
            className="w-full md:w-[28vw]"
            src={index}
            height="316"
            width="404"
            allowFullScreen
            allow="clipboard-write"
          ></iframe>
        ))}
      </div>
    </main>
  );
};

export default Projects;
