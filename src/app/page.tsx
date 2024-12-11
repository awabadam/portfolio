import Image from "next/image";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";
import hero from "";

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <div className="relative h-screen w-full justify-between border-b border-neutral-900 p-8 md:p-24">
        <Navbar />
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div>
            <p className="my-8 text-center text-7xl font-black uppercase md:my-0 lg:text-[150px]">
              Visual & Graphic Designer
            </p>
          </div>
          <Image
            src="/img/awab_hero.webp"
            alt="hero-img"
            width={500}
            height={30}
          />
        </div>

        <div className="relative z-50 flex flex-col items-baseline justify-between gap-4 md:flex-row">
          <div className="flex gap-8">
            <p className="w-full">Istanbul</p>
            <p>GMT+3</p>
          </div>
          <hr className="w-full border" />
          <div className="">
            <ul className="flex gap-8">
              <li>
                <a href="https://www.linkedin.com/in/awab-adam/">Linkedin</a>
              </li>
              <li>
                <a href="https://www.behance.net/awab-elkhalil">Behance</a>
              </li>

              <li>
                <a href="https://www.instagram.com/awabeladam/">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
