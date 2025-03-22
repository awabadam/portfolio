"use client";

import React from "react";
import { testimonials } from "@/data/testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Quote } from "lucide-react";

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden py-20"
    >
      {/* Background decorative elements */}
      <div className="absolute -left-20 top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="container relative mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </h2>
          <h3 className="mt-2 text-3xl font-bold">What My Clients Say</h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Don't just take my word for it. Here's what clients have to say
            about working with me.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="relative flex h-full flex-col p-6">
                <Quote className="absolute -left-2 -top-2 h-8 w-8 rotate-180 text-primary/20" />

                <blockquote className="mb-6 flex-1 text-lg font-medium leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    {testimonial.avatarUrl ? (
                      <AvatarImage
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center backdrop-blur">
          <h3 className="text-2xl font-bold">
            Ready to Join These Success Stories?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Let's work together to create a stunning digital presence that helps
            your business stand out and convert visitors into customers.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#contact">Get a Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">View My Portfolio</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
