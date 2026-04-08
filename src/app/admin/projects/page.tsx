"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toaster";
import { useSupabaseAuth } from "@/hooks/useSupabase";
import { Project } from "@/types";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Search,
  FolderKanban,
  Globe,
  ChevronRight,
  Home,
} from "lucide-react";

export default function AdminProjectsPage() {
  const { user, loading } = useSupabaseAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading) fetchProjects();
  }, [user, loading]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const supabase = createBrowserSupabaseClient();
      if (!supabase) throw new Error("DB not available");

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      setProjects(data || []);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) throw new Error("DB not available");
      const { error } = await supabase.from("projects").delete().eq("id", projectToDelete);
      if (error) throw new Error(error.message);
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/admin" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Projects</span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground">
              {projects.length} projects — {projects.filter((p) => p.featured).length} featured
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Link>
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <FolderKanban className="mb-4 h-10 w-10 text-muted-foreground/30" />
            <h3 className="font-semibold">{searchQuery ? "No projects match" : "No projects yet"}</h3>
            {!searchQuery && (
              <Button asChild className="mt-4">
                <Link href="/admin/projects/new">Add Project</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col transition-colors hover:border-primary/20">
                <CardContent className="flex flex-1 flex-col p-4">
                  {/* Header badges */}
                  <div className="mb-2 flex items-center gap-2">
                    {project.featured && (
                      <Badge className="gap-1 bg-yellow-500 text-yellow-50 text-[11px]">
                        <Star className="h-3 w-3" /> Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[11px]">{project.category}</Badge>
                  </div>

                  {/* Title + description */}
                  <h3 className="font-semibold leading-tight">{project.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground flex-1">{project.description}</p>

                  {/* Technologies */}
                  {(project.technologies || []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.technologies!.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-[10px]">{tech}</Badge>
                      ))}
                      {project.technologies!.length > 4 && (
                        <Badge variant="secondary" className="text-[10px]">+{project.technologies!.length - 4}</Badge>
                      )}
                    </div>
                  )}

                  {/* Result preview */}
                  {project.results && project.results.length > 0 && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400 line-clamp-1">
                      {project.results[0]}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex gap-1 border-t pt-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                      <Link href={`/admin/projects/${project.id}`}>
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Link>
                    </Button>
                    {project.live_url && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/projects/${project.id}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => { setProjectToDelete(project.id); setDeleteDialogOpen(true); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
