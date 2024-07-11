import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      <div className="w-full h-screen relative justify-between p-24 border-b border-neutral-900">
        <nav className="w-full">
          <ul className="flex w-full justify-between z-50 relative">
            <li>
              <a className="font-bold" href="/me">
                Awab Elkhalil
              </a>
            </li>
            <li>
              <a className="p-4 border" href="/">
                Let's work together
              </a>
            </li>
          </ul>
        </nav>
        <div className="h-full flex w-full select-none">
          <div className="py-auto flex items-end justify-between w-full m-auto ">
            <h1 className=" text-[420px] font-black text-left leading-[350px] -translate-x-4">
              DESIG
              <br />
              NER
            </h1>
            <p className="text-7xl uppercase font-bold z-10 -translate-y-10 -translate-x-20">
              Designing <br /> Bold <br /> websites
            </p>
          </div>
        </div>

        <div className="w-full flex justify-between gap-4 items-baseline relative z-50">
          <div className="flex gap-8 ">
            <p>Istanbul - Turkey</p>
            <p>GMT+3</p>
          </div>
          <hr className="border w-2/3 " />
          <div>
            <ul className="flex gap-8">
              <li>
                <a href="https://www.linkedin.com/in/awab-adam/">linkedin</a>
              </li>
              <li>
                <a href="https://www.behance.net/awab-elkhalil">behance</a>
              </li>
              <li>
                <a href="https://www.instagram.com/awabeladam/">instagram</a>
              </li>
            </ul>
          </div>
        </div>
        <Image
          className="absolute right-36 bottom-0 z-0 pointer-events-none"
          src={"/img/awab_hero.webp"}
          alt={""}
          width={600}
          height={200}
        />
      </div>
    </main>
  );
}
