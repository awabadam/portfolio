import Link from "next/link";
import React from "react";

const ProjectCard = () => {
  return (
    <Link
      href={
        "https://www.behance.net/gallery/168141271/Omega-Implants-Webdesign"
      }
      className="flex min-h-72 w-full flex-col justify-end rounded-xl border border-white/50 p-4"
    >
      <div className="flex w-full items-center justify-between">
        <h2>project name</h2>
        <p className="rounded-full border border-white/20 px-4 py-2 text-xs">
          project category
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
