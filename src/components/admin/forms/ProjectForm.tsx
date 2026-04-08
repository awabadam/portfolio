"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabase";

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSuccess?: () => void;
}

export default function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>(
    initialData || {
      id: "",
      title: "",
      category: "",
      description: "",
      live_url: "",
      featured: false,
      iframe_blocked: false,
      technologies: [],
      results: [],
      overview: "",
      objectives: [],
      role: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateId = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.title || !formData.category || !formData.description) {
        throw new Error("Title, category, and description are required");
      }

      const supabase = createBrowserSupabaseClient();
      if (!supabase) throw new Error("Database connection not available");

      const projectData = {
        id: formData.id || generateId(formData.title),
        title: formData.title,
        category: formData.category,
        description: formData.description,
        live_url: formData.live_url || null,
        featured: formData.featured || false,
        iframe_blocked: formData.iframe_blocked || false,
        technologies: formData.technologies && formData.technologies.length > 0 ? formData.technologies : [],
        results: formData.results && formData.results.length > 0 ? formData.results : [],
        overview: formData.overview || null,
        objectives: formData.objectives && formData.objectives.length > 0 ? formData.objectives : null,
        role: formData.role || null,
        user_id: user?.id || null,
      };

      if (initialData?.id) {
        const { id, ...updateData } = projectData;
        const { error } = await supabase.from("projects").update(updateData).eq("id", initialData.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("projects").insert([projectData]);
        if (error) throw new Error(error.message);
      }

      router.refresh();
      if (onSuccess) onSuccess();
      else router.push("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Column — Main Content */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <Input
              name="title"
              value={formData.title || ""}
              onChange={(e) => {
                const title = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  title,
                  id: initialData?.id ? prev.id : generateId(title),
                }));
              }}
              placeholder="Project title..."
              className="border-0 bg-transparent text-2xl font-bold placeholder:text-muted-foreground/40 focus-visible:ring-0 px-0"
              required
            />
            <p className="mt-1 font-mono text-xs text-muted-foreground">/{formData.id || "slug"}</p>
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Description</Label>
            <Textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Brief project description..."
              rows={3}
              required
              className="mt-1"
            />
          </div>

          {/* Overview */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Overview (case study)</Label>
            <Textarea
              name="overview"
              value={formData.overview || ""}
              onChange={handleChange}
              placeholder="Detailed project overview for the case study page..."
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Objectives */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Objectives (one per line)</Label>
            <Textarea
              value={formData.objectives?.join("\n") || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  objectives: e.target.value.split("\n").map((o) => o.trim()).filter(Boolean),
                }))
              }
              placeholder={"Create professional online presence\nIncrease patient inquiries\nImprove search rankings"}
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Results */}
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Results / Metrics (one per line)</Label>
            <Textarea
              value={formData.results?.join("\n") || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  results: e.target.value.split("\n").map((r) => r.trim()).filter(Boolean),
                }))
              }
              placeholder={"40% increase in inquiries\nMultilingual (EN, TR, AR)\n95+ Lighthouse score"}
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        {/* Right Column — Settings Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured || false}
                      onCheckedChange={(c) => setFormData((prev) => ({ ...prev, featured: c as boolean }))}
                    />
                    <Label htmlFor="featured" className="text-sm">Featured</Label>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData?.id ? "Update Project" : "Create Project"}
              </Button>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Details</p>
              <div>
                <Label className="text-xs">Category</Label>
                <Input
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  placeholder="Web Design"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Live URL</Label>
                <Input
                  name="live_url"
                  value={formData.live_url || ""}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Role</Label>
                <Input
                  name="role"
                  value={formData.role || ""}
                  onChange={handleChange}
                  placeholder="Web Designer"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Slug ID</Label>
                <Input
                  name="id"
                  value={formData.id || ""}
                  onChange={handleChange}
                  disabled={!!initialData?.id}
                  className="mt-1 font-mono text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="iframe_blocked"
                  checked={formData.iframe_blocked || false}
                  onCheckedChange={(c) => setFormData((prev) => ({ ...prev, iframe_blocked: c as boolean }))}
                />
                <Label htmlFor="iframe_blocked" className="text-xs">Iframe blocked</Label>
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Technologies</p>
              <Input
                value={formData.technologies?.join(", ") || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  }))
                }
                placeholder="Next.js, React, Tailwind"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
