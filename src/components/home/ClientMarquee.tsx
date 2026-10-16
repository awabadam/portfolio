"use client";

import { motion, useReducedMotion } from "framer-motion";

// Real clients. Image logos are pulled from their live sites; brands without a
// usable logo asset render as a styled wordmark. Per-logo height balances the
// very different aspect ratios (wide wordmarks vs. square marks) so none looks
// oversized or tiny next to the others. Jouvence's source PNG has generous
// transparent padding, so it needs extra height to read at a similar size.
export type ClientLogo = { name: string; src?: string; heightClass?: string };
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "SaphireDent", src: "/img/clients/saphiredent.png", heightClass: "h-7 md:h-8" },
  { name: "EsteExpert", src: "/img/clients/esteexpert.svg", heightClass: "h-5 md:h-6" },
  { name: "Jouvence", src: "/img/clients/jouvence.png", heightClass: "h-24 md:h-28" },
  { name: "Omar Marketing" },
  { name: "Prestij Emlak" },
];

// One client logo — image (unified grayscale in light / white silhouette in
// dark, colour on hover) or a styled wordmark fallback.
export function ClientLogoItem({ logo }: { logo: ClientLogo }) {
  if (logo.src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        decoding="async"
        className={`${logo.heightClass ?? "h-8"} w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 dark:opacity-70 dark:brightness-0 dark:invert dark:hover:opacity-100`}
      />
    );
  }
  return (
    <span className="whitespace-nowrap font-display text-xl font-medium tracking-tight text-foreground/50 transition-colors duration-300 hover:text-foreground/90 md:text-2xl">
      {logo.name}
    </span>
  );
}

// Infinite marquee: two identical groups translated -50% for a seamless loop.
// Each group must be at least as wide as the viewport, or the -50% shift opens
// a gap on the trailing edge — so the logos are repeated within a group until
// it comfortably exceeds any screen width. `reverse` scrolls the opposite way
// (used on the closing strip for variety). With reduced motion the strip is
// static. The wrapper is forced LTR: logos are direction-neutral brand marks,
// and an RTL start edge would make the -50% shift open a gap instead of looping.
export default function ClientMarquee({ logos, reverse = false }: { logos: ClientLogo[]; reverse?: boolean }) {
  const reduce = useReducedMotion();
  const REPEAT = 3;
  const groupLogos = Array.from({ length: REPEAT }).flatMap(() => logos);
  const Group = (
    <div className="flex shrink-0 items-center gap-x-14 pe-14 md:gap-x-24 md:pe-24">
      {groupLogos.map((logo, i) => (
        <ClientLogoItem key={`${logo.name}-${i}`} logo={logo} />
      ))}
    </div>
  );
  return (
    <div
      dir="ltr"
      className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
    >
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 45, ease: "linear", repeat: Infinity }}
      >
        {Group}
        {Group}
      </motion.div>
    </div>
  );
}
