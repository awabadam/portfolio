"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/lib/hooks/useSupabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, signOut } = useSupabaseAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  // Show nothing while checking authentication or if not authenticated
  if (!isClient || loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-xl font-bold">
              Admin Dashboard
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Logged in as: {user.email}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Admin Navigation */}
        <nav className="container border-t px-4">
          <ul className="flex h-10 items-center space-x-6">
            <li>
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-primary"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/projects"
                className="text-sm font-medium hover:text-primary"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="text-sm font-medium hover:text-primary"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">{children}</main>
    </div>
  );
}
