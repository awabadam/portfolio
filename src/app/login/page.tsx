import React from "react";
import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { SectionContainer } from "@/components/ui";

export const metadata: Metadata = {
  title: "Login | Awab Elkhalil",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center py-12">
      <SectionContainer
        title="Account Login"
        subtitle="Access your dashboard"
        centered
        className="max-w-md"
      >
        <LoginForm />
      </SectionContainer>
    </main>
  );
}
