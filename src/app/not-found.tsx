import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="mt-4 text-xl text-zinc-400">Page Not Found</p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-medium text-black hover:bg-zinc-200"
          >
            Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
