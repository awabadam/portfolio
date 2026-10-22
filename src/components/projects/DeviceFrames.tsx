import type { ReactNode } from "react";

// CSS device mockups for case-study screenshots. Children should fill the
// screen area (e.g. a `fill` next/image), so each frame sets its own aspect.

interface BrowserFrameProps {
  children: ReactNode;
  // Shown in the address bar, e.g. "jouvencetr.com".
  url?: string | null;
}

export function BrowserFrame({ children, url }: BrowserFrameProps) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-black/10 bg-background shadow-2xl shadow-black/15 dark:border-white/10 md:rounded-xl">
      <div
        dir="ltr"
        className="flex h-7 items-center gap-3 border-b border-black/5 bg-neutral-100 px-3 dark:border-white/5 dark:bg-neutral-800 md:h-9 md:px-4"
      >
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57] md:h-2.5 md:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e] md:h-2.5 md:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-[#28c840] md:h-2.5 md:w-2.5" />
        </div>
        {url && (
          <div className="mx-auto flex h-4 w-full max-w-xs items-center justify-center rounded-md bg-white px-3 font-mono text-[9px] text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300 md:h-5 md:text-[11px]">
            <span className="truncate">{url}</span>
          </div>
        )}
        {/* Mirrors the dots so the address bar stays centred */}
        <div aria-hidden="true" className="w-[2.625rem] md:w-12" />
      </div>
      <div className="relative aspect-[16/10] bg-muted">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[2.75rem] bg-neutral-900 p-[9px] shadow-2xl shadow-black/25 ring-1 ring-black/20 dark:ring-white/15">
      <div className="relative aspect-[780/1688] overflow-hidden rounded-[2.2rem] bg-muted">
        {children}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-2.5 z-10 h-[22px] w-[30%] -translate-x-1/2 rounded-full bg-neutral-900"
        />
      </div>
    </div>
  );
}
