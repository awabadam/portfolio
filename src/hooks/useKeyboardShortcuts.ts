"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlOrMeta = isMac ? e.metaKey : e.ctrlKey;
        const needsCtrlOrMeta = shortcut.ctrl || shortcut.meta;

        const matches =
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (needsCtrlOrMeta ? ctrlOrMeta : !ctrlOrMeta) &&
          (shortcut.shift ? e.shiftKey : !e.shiftKey) &&
          (shortcut.alt ? e.altKey : !e.altKey);

        if (matches) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

// Pre-defined admin shortcuts
export function useAdminShortcuts() {
  const router = useRouter();

  const shortcuts: ShortcutConfig[] = [
    {
      key: "d",
      ctrl: true,
      action: () => router.push("/admin"),
      description: "Go to Dashboard",
    },
    {
      key: "l",
      ctrl: true,
      action: () => router.push("/admin/leads"),
      description: "Go to Leads",
    },
    {
      key: "p",
      ctrl: true,
      action: () => router.push("/admin/projects"),
      description: "Go to Projects",
    },
    {
      key: "b",
      ctrl: true,
      action: () => router.push("/admin/blog"),
      description: "Go to Blog",
    },
    {
      key: "c",
      ctrl: true,
      action: () => router.push("/admin/chat"),
      description: "Go to Chat Logs",
    },
    {
      key: ",",
      ctrl: true,
      action: () => router.push("/admin/settings"),
      description: "Go to Settings",
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}

// Hook to show keyboard shortcuts help
export function useShortcutsHelp() {
  const shortcuts = [
    { keys: ["⌘/Ctrl", "K"], description: "Open search" },
    { keys: ["⌘/Ctrl", "D"], description: "Go to Dashboard" },
    { keys: ["⌘/Ctrl", "L"], description: "Go to Leads" },
    { keys: ["⌘/Ctrl", "P"], description: "Go to Projects" },
    { keys: ["⌘/Ctrl", "B"], description: "Go to Blog" },
    { keys: ["⌘/Ctrl", "C"], description: "Go to Chat Logs" },
    { keys: ["⌘/Ctrl", ","], description: "Go to Settings" },
    { keys: ["?"], description: "Show shortcuts help" },
  ];

  return shortcuts;
}
