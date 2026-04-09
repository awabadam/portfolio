"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Lazy-load the chat widget so its ~400 lines of WebSocket / event
// code aren't in the initial bundle. The widget button is rendered
// by ChatWidget itself after hydration — users click to open, then
// the heavy ChatWindow imports pull in.
const ChatWidget = dynamic(() => import("@/components/chat/ChatWidget"), {
  ssr: false,
  loading: () => null,
});

export function ConditionalLayout() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <Navbar />
      <ChatWidget />
    </>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return <Footer />;
}
