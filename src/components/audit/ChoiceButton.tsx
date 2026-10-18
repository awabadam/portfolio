"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChoiceButtonProps {
  /** 1-based number shown as the keyboard shortcut. */
  n: number;
  label: string;
  selected: boolean;
  /** Multi-select: shows a check when selected and uses aria-pressed as a toggle. */
  multi?: boolean;
  onClick: () => void;
}

/** One numbered answer in AuditQuestion (the main check and the qualify card). */
export default function ChoiceButton({ n, label, selected, multi = false, onClick }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex min-h-16 items-center gap-4 rounded-[10px] border px-5 py-3 text-start text-base font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card hover:border-foreground/60 hover:bg-foreground hover:text-background",
      )}
    >
      <span
        className={cn(
          "font-mono text-[11px] uppercase tracking-widest transition-colors",
          selected ? "text-background/60" : "text-muted-foreground group-hover:text-background/60",
        )}
        aria-hidden="true"
      >
        {n}
      </span>
      <span className="flex-1">{label}</span>
      {multi && (
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
            selected ? "border-background bg-background text-foreground" : "border-current opacity-40",
          )}
          aria-hidden="true"
        >
          {selected && <Check className="h-3 w-3" />}
        </span>
      )}
    </button>
  );
}
