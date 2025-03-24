"use client";

import React from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import ProjectForm from "@/components/admin/forms/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
          <p className="text-muted-foreground">
            Create a new project for your portfolio
          </p>
        </div>

        <div className="rounded-md border p-6">
          <ProjectForm />
        </div>
      </div>
    </AdminLayout>
  );
}
