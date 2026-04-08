"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import ProjectForm from "@/components/admin/forms/ProjectForm";
import { Project } from "@/types";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) return;

      try {
        setIsLoading(true);
        setError(null);

        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
          throw new Error("Database connection not available");
        }
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error("Project not found");
        }

        setProject({
          id: data.id,
          title: data.title,
          category: data.category,
          description: data.description,
          live_url: data.live_url,
          featured: data.featured,
          iframe_blocked: data.iframe_blocked,
          technologies: data.technologies || [],
          results: data.results || [],
          role: data.role,
          overview: data.overview,
          objectives: data.objectives,
        });
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">
            Update the details of your project
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : project ? (
          <div className="rounded-md border p-6">
            <ProjectForm initialData={project} />
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-medium">Project not found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              The project you are looking for does not exist or has been
              deleted.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
