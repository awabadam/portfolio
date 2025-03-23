"use client";

import React from "react";
import { BackgroundHero } from "@/components/ui";

const AboutHero = () => {
  return (
    <BackgroundHero
      title="About Me"
      subtitle="My Journey"
      description="I'm Awab Elkhalil, a passionate graphic and web designer based in Istanbul, with over 5 years of experience creating digital experiences that not only look stunning but drive real business results."
      backgroundSrc="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
      className="relative overflow-hidden"
    />
  );
};

export default AboutHero;
