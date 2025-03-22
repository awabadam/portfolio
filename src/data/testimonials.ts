export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  text: string;
  avatarUrl?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Jane Smith",
    position: "Marketing Director",
    company: "TechCorp",
    text: "Working with Awab was a pleasure. He delivered a stunning website design that perfectly captured our brand identity. His attention to detail and creative approach exceeded our expectations.",
    avatarUrl: "/img/testimonials/jane-smith.jpg"
  },
  {
    id: "testimonial-2",
    name: "Michael Johnson",
    position: "CEO",
    company: "DesignHub",
    text: "Awab's design work transformed our online presence. His ability to understand our vision and translate it into a beautiful, functional website was impressive. Highly recommended for any design project.",
    avatarUrl: "/img/testimonials/michael-johnson.jpg"
  },
  {
    id: "testimonial-3",
    name: "Sarah Williams",
    position: "Product Manager",
    company: "InnovateTech",
    text: "We hired Awab for our product redesign and couldn't be happier with the results. His creative solutions and technical expertise made the process smooth and the outcome exceptional.",
    avatarUrl: "/img/testimonials/sarah-williams.jpg"
  }
];
