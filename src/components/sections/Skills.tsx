"use client";

import React from "react";
import Link from "next/link";
import { skillCategories } from "@/data/skills";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Layout, Palette, Settings } from "lucide-react";

// Map category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  Design: <Palette className="h-5 w-5" />,
  Development: <Code className="h-5 w-5" />,
  Marketing: <Layout className="h-5 w-5" />,
  Tools: <Settings className="h-5 w-5" />,
};

const Skills = () => {
  // Get top 3 skills from each category
  const getTopSkills = (categoryName: string) => {
    const category = skillCategories.find((cat) => cat.name === categoryName);
    if (!category) return [];

    // Sort by proficiency and take top 3
    return [...category.skills]
      .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
      .slice(0, 3);
  };

  return (
    <section id="skills" className="relative w-full bg-muted/30 py-20">
      {/* Background decorative elements */}
      <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Expertise
          </h2>
          <h3 className="mt-2 text-3xl font-bold">Skills & Technologies</h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A selection of my top skills across design, development, and
            marketing.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Design Skills */}
          <Card className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                {categoryIcons.Design}
              </div>
              <CardTitle>Design</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTopSkills("Design").map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.proficiency || 0}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${skill.proficiency || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Development Skills */}
          <Card className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                {categoryIcons.Development}
              </div>
              <CardTitle>Development</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTopSkills("Development").map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.proficiency || 0}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${skill.proficiency || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button asChild className="group">
            <Link href="/about#skills" className="flex items-center gap-2">
              View All Skills
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Skills;
