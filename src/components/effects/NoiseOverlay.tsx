// Desktop-only noise overlay. The SVG feTurbulence filter is very
// GPU-expensive and rerenders every scroll frame on mobile, causing
// jank and battery drain. The effect is subtle and not noticeable on
// phones anyway, so we hide it below the md breakpoint.
export default function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden opacity-[0.03] mix-blend-overlay md:block">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
