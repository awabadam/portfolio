"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Project } from "@/types";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabase";
import { ArrowLeft } from "lucide-react";

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
        const { error } = await supabase
          .from("projects")
          .update(updateData)
          .eq("id", initialData.id);
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ID + Title */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
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
            placeholder="Project name"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="id">Slug ID</Label>
          <Input
            id="id"
            name="id"
            value={formData.id || ""}
            onChange={handleChange}
            placeholder="project-slug"
            disabled={!!initialData?.id}
            className="mt-1 font-mono text-sm"
          />
        </div>
      </div>

      {/* Category + Live URL */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            placeholder="Web Design, Web App, Portfolio"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="live_url">Live URL</Label>
          <Input
            id="live_url"
            name="live_url"
            value={formData.live_url || ""}
            onChange={handleChange}
            placeholder="https://example.com"
            className="mt-1"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Brief project description"
          rows={3}
          required
          className="mt-1"
        />
      </div>

      {/* Technologies */}
      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          value={formData.technologies?.join(", ") || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
            }))
          }
          placeholder="Next.js, React, Tailwind CSS"
          className="mt-1"
        />
      </div>

      {/* Results */}
      <div>
        <Label htmlFor="results">Results / Metrics (one per line)</Label>
        <Textarea
          id="results"
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

      {/* Overview */}
      <div>
        <Label htmlFor="overview">Overview (optional)</Label>
        <Textarea
          id="overview"
          name="overview"
          value={formData.overview || ""}
          onChange={handleChange}
          placeholder="Detailed project overview for the case study page"
          rows={3}
          className="mt-1"
        />
      </div>

      {/* Objectives */}
      <div>
        <Label htmlFor="objectives">Objectives (one per line, optional)</Label>
        <Textarea
          id="objectives"
          value={formData.objectives?.join("\n") || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              objectives: e.target.value.split("\n").map((o) => o.trim()).filter(Boolean),
            }))
          }
          placeholder={"Create professional online presence\nIncrease patient inquiries\nImprove search rankings"}
          rows={3}
          className="mt-1"
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="featured"
            checked={formData.featured || false}
            onCheckedChange={(c) => setFormData((prev) => ({ ...prev, featured: c as boolean }))}
          />
          <Label htmlFor="featured">Featured project</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="iframe_blocked"
            checked={formData.iframe_blocked || false}
            onCheckedChange={(c) => setFormData((prev) => ({ ...prev, iframe_blocked: c as boolean }))}
          />
          <Label htmlFor="iframe_blocked">Iframe blocked</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between border-t pt-6">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData?.id ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
