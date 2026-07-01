// Shared testimonial data — single source for the pricing page, services hub,
// and the standalone Testimonials section. Real client quotes (English; names
// and companies are authentic).

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "omar-karra",
    name: "Omar Karra",
    company: "Saphiredent",
    role: "Digital Marketing Media Buyer",
    content:
      "I've worked with Awab for more than 4 years, on both corporate and freelance projects. Awab always delivers — fast and efficient. He doesn't just deliver what I ask for; he gets actively involved and learns the \"what for\" so he can deliver the best possible outcome. 10/10, 24/7.",
    rating: 5,
  },
];
