"use client";

import React from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import ProjectForm from "@/components/admin/forms/ProjectForm";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export default function NewProjectPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/admin" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/admin/projects" className="hover:text-foreground transition-colors">Projects</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">New Project</span>
        </nav>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
        </div>

        <ProjectForm />
      </div>
    </AdminLayout>
  );
}
