"use client";

import React, { useState } from "react";
import { SkillCategory } from "@/data/skills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Layout, Palette, Settings, Brain } from "lucide-react";

// Map category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  Design: <Palette className="h-5 w-5" />,
  Development: <Code className="h-5 w-5" />,
  Marketing: <Layout className="h-5 w-5" />,
  Tools: <Settings className="h-5 w-5" />,
  "AI & Machine Learning": <Brain className="h-5 w-5" />,
};

interface DetailedSkillsProps {
  skillCategories: SkillCategory[];
}

const DetailedSkills = ({ skillCategories }: DetailedSkillsProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("Design");

  return (
    <section id="skills" className="w-full bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Expertise
          </h2>
          <h3 className="mt-2 text-3xl font-bold">Skills & Technologies</h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A comprehensive overview of my technical skills and proficiency
            levels across design, development, marketing, and tools.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {skillCategories.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? "default" : "outline"}
              onClick={() => setActiveCategory(category.name)}
              className="flex items-center gap-2"
            >
              {categoryIcons[category.name]}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {skillCategories
            .filter((category) => category.name === activeCategory)
            .map((category) => (
              <React.Fragment key={category.name}>
                {category.skills.map((skill) => (
                  <Card
                    key={skill.name}
                    className="border-border/30 bg-card/30 backdrop-blur transition-all duration-300 hover:border-primary/20 hover:bg-card/40"
                  >
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-base font-medium">{skill.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            {skill.proficiency || 0}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {skill.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </React.Fragment>
            ))}
        </div>

        {/* Skill Descriptions */}
        <div className="mt-16">
          <Card className="border-primary/10 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {categoryIcons[activeCategory]}
                {activeCategory} Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeCategory === "Design" && (
                <div className="space-y-4">
                  <p>
                    My design expertise spans from visual design to user
                    experience, with a focus on creating aesthetically pleasing
                    interfaces that drive user engagement and conversion. I
                    specialize in creating cohesive brand identities and
                    user-centered digital experiences.
                  </p>
                  <p>
                    Tools I'm proficient in include Adobe Creative Suite
                    (Photoshop, Illustrator), Figma for UI/UX design, and
                    various prototyping tools. I apply design thinking
                    methodologies to solve complex problems and create intuitive
                    user experiences.
                  </p>
                </div>
              )}

              {activeCategory === "Development" && (
                <div className="space-y-4">
                  <p>
                    My development skills focus on frontend technologies, with
                    expertise in HTML, CSS, JavaScript, and modern frameworks
                    like React and Next.js. I specialize in building responsive,
                    accessible, and performant web applications.
                  </p>
                  <p>
                    I'm particularly skilled with Tailwind CSS for rapid UI
                    development and have experience integrating with various
                    APIs and backend services. My code is clean, maintainable,
                    and follows best practices for performance and
                    accessibility.
                  </p>
                </div>
              )}

              {activeCategory === "Marketing" && (
                <div className="space-y-4">
                  <p>
                    My marketing expertise complements my design and development
                    skills, allowing me to create digital experiences that not
                    only look great but also achieve business objectives. I
                    understand the principles of conversion optimization,
                    content strategy, and digital marketing.
                  </p>
                  <p>
                    I can implement SEO best practices, create compelling
                    content, and design marketing materials that align with
                    brand strategy and business goals. This holistic approach
                    ensures that the digital products I create drive measurable
                    results.
                  </p>
                </div>
              )}

              {activeCategory === "Tools" && (
                <div className="space-y-4">
                  <p>
                    I'm proficient with a wide range of tools that support my
                    design and development workflow. From version control with
                    Git to code editors like VS Code, I leverage the best tools
                    to ensure efficient and effective project execution.
                  </p>
                  <p>
                    My experience with design tools like Adobe XD and Sketch
                    complements my development toolkit, allowing for seamless
                    transitions from design to implementation. I continuously
                    explore new tools and technologies to enhance my workflow
                    and deliver better results.
                  </p>
                </div>
              )}

              {activeCategory === "AI & Machine Learning" && (
                <div className="space-y-4">
                  <p>
                    My AI and machine learning skills enable me to leverage
                    cutting-edge technologies in creative and practical ways.
                    I'm skilled at prompt engineering and integrating language
                    models into applications to enhance functionality and user
                    experience.
                  </p>
                  <p>
                    I stay informed about AI developments and ethical
                    considerations, allowing me to implement AI tools
                    responsibly. My experience spans content creation, image
                    generation, and workflow automation using various AI
                    platforms and technologies.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DetailedSkills;
