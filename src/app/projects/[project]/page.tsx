import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <main className="flex h-fit w-fit flex-col items-center justify-center gap-4">
      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
        <div className="absolute bottom-6 left-12">
          <h1>january ad campaign</h1>
          <p>project description</p>
        </div>
        <Image
          src={"/img/03 (Done)/00.png"}
          width={1920}
          height={1080}
          alt={""}
        />
      </div>

      <div className="mt-32 text-center md:my-20">
        <h1 className="text-4xl uppercase">Project title</h1>{" "}
      </div>
    </main>
  );
};

export default page;
