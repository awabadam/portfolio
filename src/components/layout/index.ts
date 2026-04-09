// NOTE: PageHero and BackgroundHero are intentionally NOT re-exported
// here. Both transitively import three.js via dynamic(), and including
// them in this barrel caused Turbopack to eagerly load ~230 KB of
// three.js into the main app bundle on pages that never used either
// component. Consumers must import them directly from their files:
//
//   import BackgroundHero from '@/components/layout/BackgroundHero';
//   import PageHero from '@/components/layout/PageHero';

export { default as Navbar } from './Navbar';
export { default as Footer } from './Footer';
export { ConditionalLayout, ConditionalFooter } from './ConditionalLayout';
export { default as GridLayout } from './GridLayout';
export { default as SectionContainer } from './SectionContainer';
