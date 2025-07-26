import { BlogPost, BlogCategory } from "../types";
import { createAppServerClient } from "@/lib/supabase/server-app";
import { createStaticSupabaseClient } from "@/lib/supabase/server-static";

// Fallback blog posts data if Supabase is not available
export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "web-design-trends-2024",
    title: "Web Design Trends That Will Dominate 2024",
    slug: "web-design-trends-2024",
    excerpt: "Discover the latest web design trends that will shape the digital landscape in 2024. From AI-powered interfaces to sustainable design practices.",
    content: `
# Web Design Trends That Will Dominate 2024

The web design landscape is constantly evolving, and 2024 brings exciting new trends that will shape how we create digital experiences. As a web designer in Istanbul, I'm always staying ahead of these trends to deliver cutting-edge solutions for my clients.

## 1. AI-Powered Personalization

Artificial Intelligence is revolutionizing web design by enabling highly personalized user experiences. From dynamic content that adapts to user behavior to AI-generated design elements, this trend is here to stay.

**Key Benefits:**
- Improved user engagement
- Higher conversion rates
- Better user retention

## 2. Sustainable Web Design

With growing environmental awareness, sustainable web design practices are becoming increasingly important. This includes optimizing for energy efficiency and reducing carbon footprints.

**Implementation Tips:**
- Optimize images and assets
- Use efficient coding practices
- Choose green hosting providers

## 3. Micro-Interactions and Animations

Subtle animations and micro-interactions continue to enhance user experience, making websites feel more alive and responsive.

## 4. Dark Mode Optimization

Dark mode is no longer just a trend—it's an expectation. Modern websites must provide excellent dark mode experiences.

## 5. Voice User Interface (VUI)

As voice assistants become more prevalent, designing for voice interactions is becoming crucial for modern web applications.

## Conclusion

Staying current with these trends is essential for any web designer looking to create impactful digital experiences. In Istanbul's competitive market, these innovations can set your work apart and help clients achieve their business goals.

*Ready to implement these trends in your next project? Let's discuss how we can bring these cutting-edge design principles to your website.*
    `,
    featured_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop",
    category: "Web Design",
    tags: ["web design", "trends", "2024", "UI/UX", "digital design"],
    published: true,
    published_at: "2024-01-15T10:00:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    meta_title: "Web Design Trends 2024: What's Hot in Digital Design",
    meta_description: "Discover the latest web design trends for 2024. From AI-powered interfaces to sustainable design practices, learn what's shaping the future of web design.",
    reading_time: 8,
    view_count: 1250
  },
  {
    id: "seo-tips-for-designers",
    title: "SEO Tips Every Web Designer Should Know",
    slug: "seo-tips-for-designers",
    excerpt: "Learn essential SEO strategies that web designers can implement to improve website rankings and drive more organic traffic for their clients.",
    content: `
# SEO Tips Every Web Designer Should Know

As a web designer, understanding SEO is crucial for creating websites that not only look great but also perform well in search engines. Here are essential SEO strategies that every designer should implement.

## 1. Technical SEO Fundamentals

### Page Speed Optimization
- Optimize images and use modern formats (WebP, AVIF)
- Minimize CSS and JavaScript
- Use efficient hosting and CDNs

### Mobile-First Design
- Ensure responsive design
- Optimize for mobile user experience
- Test on various devices

## 2. On-Page SEO Elements

### Title Tags and Meta Descriptions
- Create compelling, keyword-rich titles
- Write engaging meta descriptions
- Keep titles under 60 characters

### Header Structure
- Use proper H1, H2, H3 hierarchy
- Include relevant keywords naturally
- Make content scannable

## 3. Content Optimization

### Keyword Research
- Identify relevant keywords for your niche
- Use long-tail keywords for better targeting
- Create content around user intent

### Content Quality
- Write valuable, informative content
- Use internal linking strategies
- Include relevant images with alt text

## 4. Local SEO for Istanbul Market

### Google My Business
- Optimize business listings
- Encourage customer reviews
- Include local keywords

### Local Content
- Create location-specific content
- Use local keywords naturally
- Build local citations

## 5. User Experience and SEO

### Site Architecture
- Create logical site structure
- Implement breadcrumb navigation
- Ensure easy navigation

### Core Web Vitals
- Optimize Largest Contentful Paint (LCP)
- Reduce First Input Delay (FID)
- Minimize Cumulative Layout Shift (CLS)

## Conclusion

SEO and web design go hand in hand. By implementing these strategies, you can create websites that not only look professional but also rank well in search engines, driving more organic traffic and conversions for your clients.

*Need help implementing these SEO strategies in your web design projects? Let's discuss how we can optimize your website for better search engine performance.*
    `,
    featured_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    category: "SEO",
    tags: ["SEO", "web design", "search optimization", "digital marketing", "Istanbul"],
    published: true,
    published_at: "2024-01-10T14:30:00Z",
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
    meta_title: "SEO Tips for Web Designers: Boost Your Website Rankings",
    meta_description: "Essential SEO strategies for web designers. Learn how to create websites that rank well in search engines and drive organic traffic.",
    reading_time: 10,
    view_count: 890
  },
  {
    id: "freelance-design-tips",
    title: "Freelance Design Success: Tips from an Istanbul Designer",
    slug: "freelance-design-tips",
    excerpt: "Learn valuable insights and practical tips for building a successful freelance design career, based on real experience in Istanbul's competitive market.",
    content: `
# Freelance Design Success: Tips from an Istanbul Designer

Building a successful freelance design career requires more than just creative skills. After years of working as a freelance designer in Istanbul, I've learned valuable lessons that can help you thrive in this competitive industry.

## 1. Building Your Brand

### Define Your Niche
- Specialize in specific design areas
- Develop a unique style and approach
- Create a memorable brand identity

### Professional Online Presence
- Build a stunning portfolio website
- Maintain active social media profiles
- Showcase your best work consistently

## 2. Client Management

### Communication Skills
- Set clear expectations from the start
- Provide regular project updates
- Handle feedback professionally

### Project Management
- Use project management tools
- Set realistic deadlines
- Create detailed project briefs

## 3. Pricing Strategies

### Value-Based Pricing
- Price based on value delivered, not time spent
- Consider project complexity and client budget
- Don't undervalue your expertise

### Package Deals
- Create service packages for common needs
- Offer different pricing tiers
- Include upsell opportunities

## 4. Marketing and Networking

### Local Networking
- Attend design events in Istanbul
- Join professional organizations
- Build relationships with other creatives

### Online Marketing
- Create valuable content for your blog
- Use social media effectively
- Leverage client testimonials

## 5. Financial Management

### Budget Planning
- Track income and expenses
- Set aside money for taxes
- Plan for slow periods

### Contract and Legal
- Use professional contracts
- Protect your intellectual property
- Understand local business regulations

## 6. Continuous Learning

### Skill Development
- Stay updated with design trends
- Learn new tools and technologies
- Take online courses and workshops

### Industry Knowledge
- Follow design blogs and publications
- Attend conferences and webinars
- Join online design communities

## Conclusion

Success as a freelance designer requires a combination of creative talent, business acumen, and continuous learning. By implementing these strategies, you can build a thriving freelance career in Istanbul's dynamic design market.

*Ready to take your freelance design career to the next level? Let's discuss how we can help you achieve your goals.*
    `,
    featured_image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    category: "Freelancing",
    tags: ["freelancing", "design career", "business tips", "Istanbul", "creative business"],
    published: true,
    published_at: "2024-01-05T09:15:00Z",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-05T09:15:00Z",
    meta_title: "Freelance Design Success Tips from Istanbul Designer",
    meta_description: "Learn valuable insights for building a successful freelance design career. Practical tips from an experienced designer in Istanbul's competitive market.",
    reading_time: 12,
    view_count: 1560
  }
];

export const fallbackBlogCategories: BlogCategory[] = [
  {
    id: "web-design",
    name: "Web Design",
    slug: "web-design",
    description: "Articles about web design principles, trends, and best practices",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description: "User interface and user experience design insights",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    slug: "graphic-design",
    description: "Graphic design tips, tutorials, and inspiration",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "seo",
    name: "SEO",
    slug: "seo",
    description: "Search engine optimization guides and tips",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "freelancing",
    name: "Freelancing",
    slug: "freelancing",
    description: "Freelance design and development advice",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  try {
    console.log(`🔍 Fetching blog post with slug: ${slug}`);
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (error) {
      console.error(`❌ Error fetching blog post for slug "${slug}":`, error);
      console.log('🔄 Falling back to static data');
      return fallbackBlogPosts.find(post => post.slug === slug);
    }
    
    if (!data) {
      console.log(`⚠️ No published post found for slug "${slug}", checking fallback data`);
      return fallbackBlogPosts.find(post => post.slug === slug);
    }
    
    console.log(`✅ Successfully fetched blog post: ${data.title}`);
    return data as BlogPost;
  } catch (error) {
    console.error(`❌ Error in getBlogPostBySlug for slug "${slug}":`, error);
    console.log('🔄 Falling back to static data');
    return fallbackBlogPosts.find(post => post.slug === slug);
  }
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    console.log('🔍 Fetching all blog posts from Supabase...');
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching blog posts:', error);
      console.log('🔄 Falling back to static data');
      return fallbackBlogPosts;
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ No published posts found in database, using fallback data');
      return fallbackBlogPosts;
    }
    
    console.log(`✅ Successfully fetched ${data.length} blog posts from Supabase`);
    return data as BlogPost[];
  } catch (error) {
    console.error('❌ Error in getAllBlogPosts:', error);
    console.log('🔄 Falling back to static data');
    return fallbackBlogPosts;
  }
};

export const getFeaturedBlogPosts = async (count: number = 3): Promise<BlogPost[]> => {
  try {
    console.log(`🔍 Fetching ${count} featured blog posts from Supabase...`);
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('view_count', { ascending: false })
      .limit(count);
    
    if (error) {
      console.error('❌ Error fetching featured blog posts:', error);
      console.log('🔄 Falling back to static data');
      return fallbackBlogPosts.slice(0, count);
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ No featured posts found in database, using fallback data');
      return fallbackBlogPosts.slice(0, count);
    }
    
    console.log(`✅ Successfully fetched ${data.length} featured blog posts from Supabase`);
    return data as BlogPost[];
  } catch (error) {
    console.error('❌ Error in getFeaturedBlogPosts:', error);
    console.log('🔄 Falling back to static data');
    return fallbackBlogPosts.slice(0, count);
  }
};

export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('category', category)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts by category:', error);
      return fallbackBlogPosts.filter(post => post.category === category);
    }
    
    return data as BlogPost[];
  } catch (error) {
    console.error('Error in getBlogPostsByCategory:', error);
    return fallbackBlogPosts.filter(post => post.category === category);
  }
};

export const getAllBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching blog categories:', error);
      return fallbackBlogCategories;
    }
    
    return data as BlogCategory[];
  } catch (error) {
    console.error('Error in getAllBlogCategories:', error);
    return fallbackBlogCategories;
  }
};

export const searchBlogPosts = async (query: string): Promise<BlogPost[]> => {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error searching blog posts:', error);
      return fallbackBlogPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    return data as BlogPost[];
  } catch (error) {
    console.error('Error in searchBlogPosts:', error);
    return fallbackBlogPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}; 