"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiRoute = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "data" }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error("Error testing API route:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-2xl font-bold">API Route Test</h1>

      <Button onClick={testApiRoute} disabled={loading}>
        {loading ? "Testing..." : "Test API Route"}
      </Button>

      {error && (
        <div className="mt-4 rounded bg-red-100 p-4 text-red-700">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 rounded bg-green-100 p-4 text-green-700">
          <p className="font-bold">Result:</p>
          <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
