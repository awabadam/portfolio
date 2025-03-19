import Link from "next/link";
import React from "react";
import ProjectCard from "./ui/ProjectCard";

const projects = [
  "https://www.behance.net/embed/project/168141271?ilo0=1",
  "https://www.behance.net/embed/project/104684137?ilo0=1",
  "https://www.behance.net/embed/project/125053859?ilo0=1",
  "https://www.behance.net/embed/project/124152191?ilo0=1",
  "https://www.behance.net/embed/project/124161365?ilo0=1",
  "https://www.behance.net/embed/project/104690015?ilo0=1",
];

const Projects = (props: any) => {
  return (
    <main className="flex h-fit w-fit flex-col items-center justify-center gap-4 py-32">
      <div className="p-4 text-center">
        <h1 className="text-4xl uppercase">Projects</h1>{" "}
        <div className="mt-3 hover:underline md:mt-6">
          {props.number > 0 ? <Link href="/projects">see more →</Link> : <></>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {props.number > 0
          ? projects.slice(0, props.number).map((project, key) => (
              <div className="flex items-center justify-center overflow-clip">
                <iframe
                  key={key}
                  className="w-full overflow-clip md:w-[28vw]"
                  src={project}
                  height="316"
                  width="404"
                  allowFullScreen
                  allow="clipboard-write"
                ></iframe>
              </div>
            ))
          : projects.map((project, key) => (
              <div className="flex items-center justify-center overflow-clip p-4">
                <iframe
                  key={key}
                  className="w-full overflow-clip md:w-[28vw]"
                  src={project}
                  height="316"
                  width="404"
                  allowFullScreen
                  allow="clipboard-write"
                ></iframe>
              </div>
            ))}
      </div>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard />
        ))}
      </div>
    </main>
  );
};

export default Projects;
