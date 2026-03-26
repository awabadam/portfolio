"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function DeleteProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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
          .select("title")
          .eq("id", params.id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error("Project not found");
        }

        setProjectTitle(data.title);
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

  const handleDelete = async () => {
    if (!params.id) return;

    try {
      setIsDeleting(true);
      setError(null);

      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        throw new Error("Database connection not available");
      }
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", params.id);

      if (error) {
        throw new Error(error.message);
      }

      // Success - redirect to projects list
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delete Project</h1>
          <p className="text-muted-foreground">
            Confirm deletion of this project
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
        ) : (
          <div className="rounded-md border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Are you sure you want to delete this project?
            </h2>
            <p className="mb-6">
              You are about to delete the project:{" "}
              <span className="font-medium">{projectTitle}</span>
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete the
              project and all associated data.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
