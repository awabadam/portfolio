export interface Skill {
  name: string;
  icon?: string;
  proficiency?: number; // 1-100 percentage
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Design",
    skills: [
      { name: "Adobe Photoshop", proficiency: 90 },
      { name: "Adobe Illustrator", proficiency: 85 },
      { name: "Figma", proficiency: 95 },
      { name: "UI/UX Design", proficiency: 88 },
      { name: "Brand Identity", proficiency: 92 },
    ],
  },
  {
    name: "Development",
    skills: [
      { name: "HTML/CSS", proficiency: 95 },
      { name: "JavaScript", proficiency: 85 },
      { name: "React", proficiency: 80 },
      { name: "Next.js", proficiency: 75 },
      { name: "Tailwind CSS", proficiency: 90 },
    ],
  },
  {
    name: "Marketing",
    skills: [
      { name: "Social Media", proficiency: 88 },
      { name: "Content Creation", proficiency: 85 },
      { name: "SEO", proficiency: 75 },
      { name: "Email Marketing", proficiency: 80 },
    ],
  },
  {
    name: "Tools",
    skills: [
      { name: "Git", proficiency: 85 },
      { name: "VS Code", proficiency: 90 },
      { name: "Adobe XD", proficiency: 88 },
      { name: "Sketch", proficiency: 80 },
    ],
  },
];
