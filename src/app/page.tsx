import { Header, Navbar, Projects } from "./components";

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <Header />
      <Projects />
    </main>
  );
}
