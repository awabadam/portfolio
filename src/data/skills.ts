export interface Skill {
  name: string;
  icon?: string;
  proficiency: number; // 1-100 percentage
  description: string; // Short sentence describing the skill
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Design",
    skills: [
      { name: "Adobe Photoshop", proficiency: 90, description: "Adept at photo manipulation, digital compositions, and advanced retouching techniques." },
      { name: "Adobe Illustrator", proficiency: 85, description: "Skilled in vector artwork, logo design, and creating scalable graphics." },
      { name: "Figma", proficiency: 70, description: "Competent with collaborative UI design, prototyping, and component systems." },
      { name: "UI/UX Design", proficiency: 80, description: "Well-versed in user-centered design principles and creating intuitive interfaces." },
      { name: "Brand Identity", proficiency: 75, description: "Capable of developing cohesive visual systems and brand guidelines." },
    ],
  },
  {
    name: "Development",
    skills: [
      { name: "HTML/CSS", proficiency: 95, description: "Strong command of semantic markup and advanced CSS techniques for responsive layouts." },
      { name: "JavaScript", proficiency: 85, description: "Solid understanding of ES6+ features, DOM manipulation, and asynchronous programming." },
      { name: "React", proficiency: 80, description: "Skilled with component architecture, hooks, and state management." },
      { name: "Next.js", proficiency: 85, description: "Skilled at building full-stack applications with server components, API routes, and optimized rendering strategies." },
      { name: "Tailwind CSS", proficiency: 90, description: "Highly skilled at utility-first CSS and creating custom design systems." },
    ],
  },
  {
    name: "Marketing",
    skills: [
      { name: "Social Media", proficiency: 88, description: "Adept at platform-specific content strategy and community engagement." },
      { name: "Content Creation", proficiency: 85, description: "Skilled in producing compelling written and visual content for diverse audiences." },
      { name: "SEO", proficiency: 75, description: "Knowledgeable about on-page optimization, keyword research, and technical SEO principles." },
      { name: "Email Marketing", proficiency: 80, description: "Well-versed in campaign planning, A/B testing, and automation workflows." },
    ],
  },
  {
    name: "Tools",
    skills: [
      { name: "Git", proficiency: 85, description: "Skilled with version control, branching strategies, and collaborative workflows." },
      { name: "VS Code", proficiency: 90, description: "Highly proficient with extensions, custom configurations, and debugging tools." },
      { name: "Adobe XD", proficiency: 88, description: "Skilled in creating interactive prototypes and design specifications." },
      { name: "Sketch", proficiency: 80, description: "Competent with design systems, symbols, and responsive layouts." },
    ],
  },
  {
    name: "AI & Machine Learning",
    skills: [
      { name: "AI Prompt Engineering", proficiency: 92, description: "Skilled at crafting effective prompts to achieve desired outputs from various AI models." },
      { name: "AI Tools", proficiency: 88, description: "Adept with various AI tools for content creation, image generation, and workflow automation." },
      { name: "AI Concepts", proficiency: 82, description: "Solid understanding of foundational AI concepts, capabilities, and limitations." },
      { name: "AI Ethics", proficiency: 78, description: "Knowledgeable about ethical considerations and best practices in AI implementation." },
    ],
  },
];