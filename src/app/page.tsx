import { Header, Navbar, Projects } from "./components";

export default function Home() {
  return (
    <main className="max-w-screen flex min-h-screen flex-col items-center">
      <Header />
      <Projects number={3} />
    </main>
  );
}
