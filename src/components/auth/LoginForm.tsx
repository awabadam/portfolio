"use client";
import React, { useEffect, useState } from "react";
import { useSupabaseAuth } from "@/lib/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { isLocalAuthEnabled } from "@/lib/auth/localAuth";

export default function LoginForm() {
  const { user, signIn, loading, isLocalAuth, isConfigured } = useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const isDev = isLocalAuthEnabled();

  useEffect(() => {
    setIsClient(true);

    // If not loading and no user, redirect to login
    if (user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess(true);
        router.push("/admin");
        // Redirect or update UI as needed
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  const handleLocalLogin = () => {
    setEmail("admin@local.dev");
    setPassword("admin");
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Login</h2>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Configuration Warning */}
      {!loading && !isConfigured && !isDev && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          <p className="font-semibold">Authentication Not Configured</p>
          <p className="mt-1 text-xs">
            The authentication service is not properly configured. Please ensure the Supabase environment variables are set correctly.
          </p>
        </div>
      )}

      {/* Local Dev Info */}
      {isDev && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <p className="font-semibold">Development Mode</p>
          <p className="mt-1 text-xs">
            Local admin login available. Use: <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900">admin@local.dev</code> / <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900">admin</code>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={handleLocalLogin}
          >
            Fill Local Credentials
          </Button>
        </div>
      )}

      {isLocalAuth && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
          <p className="font-semibold">Using Local Authentication</p>
          <p className="mt-1 text-xs">You are logged in with local development credentials.</p>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-500 dark:bg-green-950 dark:text-green-400">
          Login successful! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type={isDev ? "text" : "email"}
            placeholder={isDev ? "admin@local.dev or admin" : "your.email@example.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
