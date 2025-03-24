import React from "react";
import { Metadata } from "next";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Dashboard | Portfolio",
  description: "Admin dashboard for portfolio management",
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your portfolio content and settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Projects Card */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage your portfolio projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Add, edit, or remove projects from your portfolio.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/admin/projects">Manage Projects</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Skills Card */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>
                Manage your skills and expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Update your skills, technologies, and proficiency levels.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/admin/skills">Manage Skills</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Testimonials Card */}
          <Card>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
              <CardDescription>Manage client testimonials</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Add or update testimonials from clients and collaborators.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/admin/testimonials">Manage Testimonials</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
