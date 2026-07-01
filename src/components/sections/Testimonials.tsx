"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const Testimonials = () => {
  return (
    <section className="w-full bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </h2>
          <h3 className="mt-2 text-3xl font-bold">What My Clients Say</h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Don't just take my word for it. Here's what my clients have to say
            about working together and the results we've achieved.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4 flex justify-start">
                  <Quote className="h-8 w-8 text-primary/30" />
                </div>

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">
              Projects Completed
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">
              Client Satisfaction
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-primary">24hr</div>
            <div className="text-sm text-muted-foreground">Response Time</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-primary">5+</div>
            <div className="text-sm text-muted-foreground">
              Years Experience
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
