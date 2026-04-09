// Re-export from new locations for backwards compatibility.
// NOTE: PageHero / BackgroundHero intentionally excluded — they pull
// in three.js and must be imported directly from their files to keep
// three.js out of the main app bundle. See @/components/layout/index.ts
// for the full explanation.
export { SectionContainer, GridLayout } from "@/components/layout";
export { ContentCard, ProjectCard, BlogCard } from "@/components/cards";
export { VisualElement } from "@/components/effects";
export { ImageGallery } from "@/components/media";

// shadcn/ui primitives
export * from "./button";
export * from "./card";
export * from "./badge";
export * from "./input";
export * from "./textarea";
export * from "./sheet";
export * from "./navigation-menu";
export * from "./avatar";
export * from "./checkbox";
export * from "./separator";
