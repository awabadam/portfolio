-- Complete Supabase Portfolio Database Setup
-- Run this in your new Supabase project SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  behance_url TEXT NOT NULL,
  thumbnail_url TEXT,
  images TEXT[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  
  -- Case study fields
  role TEXT,
  overview TEXT,
  objectives TEXT[],
  approach TEXT[],
  design_concept TEXT,
  final_thoughts TEXT
);

-- Create indexes for projects
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Enable RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS policies for projects
CREATE POLICY "Projects are viewable by everyone" 
  ON projects FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own projects" 
  ON projects FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON projects FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON projects FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Trigger for projects
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SKILLS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create indexes for skills
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_proficiency ON skills(proficiency);

-- Enable RLS for skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- RLS policies for skills
CREATE POLICY "Skills are viewable by everyone" 
  ON skills FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own skills" 
  ON skills FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" 
  ON skills FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" 
  ON skills FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Trigger for skills
CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON skills
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TESTIMONIALS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create indexes for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);

-- Enable RLS for testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- RLS policies for testimonials
CREATE POLICY "Testimonials are viewable by everyone" 
  ON testimonials FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own testimonials" 
  ON testimonials FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own testimonials" 
  ON testimonials FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own testimonials" 
  ON testimonials FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Trigger for testimonials
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- BLOG SYSTEM
-- ============================================================================

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta_title TEXT,
  meta_description TEXT,
  reading_time INTEGER DEFAULT 5,
  view_count INTEGER DEFAULT 0
);

-- Create indexes for blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count ON blog_posts(view_count);

-- Enable RLS for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_posts
CREATE POLICY "Published blog posts are viewable by everyone" 
  ON blog_posts FOR SELECT 
  USING (published = true);

CREATE POLICY "Users can insert their own blog posts" 
  ON blog_posts FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blog posts" 
  ON blog_posts FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = author_id OR author_id IS NULL);

CREATE POLICY "Users can delete their own blog posts" 
  ON blog_posts FOR DELETE 
  TO authenticated 
  USING (auth.uid() = author_id OR author_id IS NULL);

-- Trigger for blog_posts
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for blog_categories
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON blog_categories(name);

-- Trigger for blog_categories
CREATE TRIGGER update_blog_categories_updated_at
BEFORE UPDATE ON blog_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Web Design', 'web-design', 'Articles about web design principles, trends, and best practices'),
  ('UI/UX Design', 'ui-ux-design', 'User interface and user experience design insights'),
  ('Graphic Design', 'graphic-design', 'Graphic design tips, tutorials, and inspiration'),
  ('Digital Marketing', 'digital-marketing', 'Digital marketing strategies and tips'),
  ('SEO', 'seo', 'Search engine optimization guides and tips'),
  ('Freelancing', 'freelancing', 'Freelance design and development advice'),
  ('Tools & Resources', 'tools-resources', 'Recommended tools and resources for designers'),
  ('Case Studies', 'case-studies', 'Detailed project case studies and breakdowns')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample projects
INSERT INTO projects (title, category, description, behance_url, thumbnail_url, featured, role, overview, objectives, approach, design_concept, final_thoughts, user_id) VALUES
  ('Omega Implants Webdesign', 'Web Design', 'Website design for a dental implant company', 'https://www.behance.net/embed/project/168141271?ilo0=1', '/img/projects/omega-implants.png', true, 'Web Designer', 'This project involved creating a modern, professional website for Omega Implants, a leading dental implant provider. The website was designed to showcase their services, educate potential patients, and generate leads.', ARRAY['Create a professional and trustworthy online presence', 'Educate visitors about dental implant procedures and benefits', 'Highlight the company''s expertise and technology', 'Generate leads through contact forms and appointment scheduling', 'Improve the overall user experience and accessibility'], ARRAY['Conducted thorough research on the dental implant industry', 'Created wireframes and prototypes for client approval', 'Developed a clean, medical-focused design with clear navigation', 'Implemented responsive design for optimal viewing on all devices', 'Integrated contact forms and appointment scheduling functionality'], 'The design concept focused on creating a clean, professional aesthetic that inspires trust and confidence. Blue tones were used throughout to convey professionalism and reliability, while clear typography ensures readability for all users. The layout prioritizes important information and makes it easy for potential patients to learn about services and contact the clinic.', 'This project successfully delivered a modern, functional website that effectively communicates Omega Implants'' services and expertise. The clean design and intuitive navigation have helped improve user engagement and lead generation since launch.', NULL),
  ('January Ad Campaign', 'Advertising', 'Marketing campaign for January promotions', 'https://www.behance.net/embed/project/104684137?ilo0=1', '/img/projects/january-campaign.png', true, 'Graphic Designer', 'A comprehensive advertising campaign designed to boost sales during the January period.', ARRAY['Increase brand awareness', 'Drive sales during slow period', 'Engage target audience'], ARRAY['Market research and competitor analysis', 'Creative concept development', 'Multi-channel campaign execution'], 'Modern, vibrant design with strong call-to-action elements.', 'The campaign successfully increased engagement and sales during the target period.', NULL),
  ('Brand Identity Design', 'Branding', 'Complete brand identity package for a startup', 'https://www.behance.net/embed/project/125053859?ilo0=1', '/img/projects/brand-identity.jpg', true, 'Brand Designer', 'Complete brand identity design including logo, color palette, typography, and brand guidelines.', ARRAY['Create memorable brand identity', 'Establish brand guidelines', 'Ensure scalability across platforms'], ARRAY['Brand research and positioning', 'Logo design and iterations', 'Brand guidelines development'], 'Clean, modern design that reflects the startup''s innovative approach.', 'The brand identity successfully positioned the startup as a modern, trustworthy company.', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, category, proficiency, icon, user_id) VALUES
  ('HTML/CSS', 'Frontend', 95, 'html5', NULL),
  ('JavaScript', 'Frontend', 90, 'javascript', NULL),
  ('React', 'Frontend', 88, 'react', NULL),
  ('Next.js', 'Frontend', 85, 'nextjs', NULL),
  ('TypeScript', 'Frontend', 80, 'typescript', NULL),
  ('Tailwind CSS', 'Frontend', 92, 'tailwind', NULL),
  ('Node.js', 'Backend', 75, 'nodejs', NULL),
  ('PostgreSQL', 'Database', 70, 'postgresql', NULL),
  ('Figma', 'Design', 90, 'figma', NULL),
  ('Adobe Photoshop', 'Design', 85, 'photoshop', NULL),
  ('Adobe Illustrator', 'Design', 80, 'illustrator', NULL),
  ('UI/UX Design', 'Design', 88, 'ux', NULL),
  ('Responsive Design', 'Design', 95, 'responsive', NULL),
  ('SEO', 'Marketing', 75, 'seo', NULL),
  ('Google Analytics', 'Marketing', 70, 'analytics', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (name, position, company, content, avatar_url, user_id) VALUES
  ('Sarah Johnson', 'Marketing Director', 'TechStart Inc.', 'Awab delivered an exceptional website that exceeded our expectations. His attention to detail and understanding of our business needs resulted in a site that perfectly represents our brand and drives conversions.', NULL, NULL),
  ('Michael Chen', 'Founder', 'GreenTech Solutions', 'Working with Awab was a game-changer for our startup. He not only created a stunning website but also provided valuable insights on user experience and conversion optimization. Highly recommended!', NULL, NULL),
  ('Emily Rodriguez', 'Creative Director', 'Design Studio Pro', 'Awab''s technical skills and creative vision are outstanding. He transformed our ideas into a beautiful, functional website that our clients love. The project was delivered on time and within budget.', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image_url, category, tags, published, published_at, meta_title, meta_description, reading_time, view_count) VALUES
  ('Web Design Trends That Will Dominate 2024', 'web-design-trends-2024', 'Discover the latest web design trends that will shape the digital landscape in 2024. From AI-powered interfaces to sustainable design practices.', '# Web Design Trends That Will Dominate 2024

The web design landscape is constantly evolving, and 2024 brings exciting new trends that will shape how we create digital experiences. As a web designer in Istanbul, I''m always staying ahead of these trends to deliver cutting-edge solutions for my clients.

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

Dark mode is no longer just a trend—it''s an expectation. Modern websites must provide excellent dark mode experiences.

## 5. Voice User Interface (VUI)

As voice assistants become more prevalent, designing for voice interactions is becoming crucial for modern web applications.

## Conclusion

Staying current with these trends is essential for any web designer looking to create impactful digital experiences. In Istanbul''s competitive market, these innovations can set your work apart and help clients achieve their business goals.

*Ready to implement these trends in your next project? Let''s discuss how we can bring these cutting-edge design principles to your website.*', '/img/blog/web-design-trends-2024.jpg', 'Web Design', ARRAY['web design', 'trends', '2024', 'UI/UX', 'digital design'], true, NOW(), 'Web Design Trends 2024: What''s Hot in Digital Design', 'Discover the latest web design trends for 2024. From AI-powered interfaces to sustainable design practices, learn what''s shaping the future of web design.', 8, 1250),
  ('SEO Tips Every Web Designer Should Know', 'seo-tips-for-designers', 'Learn essential SEO strategies that web designers can implement to improve website rankings and drive more organic traffic for their clients.', '# SEO Tips Every Web Designer Should Know

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

*Need help implementing these SEO strategies in your web design projects? Let''s discuss how we can optimize your website for better search engine performance.*', '/img/blog/seo-tips-designers.jpg', 'SEO', ARRAY['SEO', 'web design', 'search optimization', 'digital marketing', 'Istanbul'], true, NOW(), 'SEO Tips for Web Designers: Boost Your Website Rankings', 'Essential SEO strategies for web designers. Learn how to create websites that rank well in search engines and drive organic traffic.', 10, 890),
  ('Freelance Design Success: Tips from an Istanbul Designer', 'freelance-design-tips', 'Learn valuable insights and practical tips for building a successful freelance design career, based on real experience in Istanbul''s competitive market.', '# Freelance Design Success: Tips from an Istanbul Designer

Building a successful freelance design career requires more than just creative skills. After years of working as a freelance designer in Istanbul, I''ve learned valuable lessons that can help you thrive in this competitive industry.

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
- Don''t undervalue your expertise

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

Success as a freelance designer requires a combination of creative talent, business acumen, and continuous learning. By implementing these strategies, you can build a thriving freelance career in Istanbul''s dynamic design market.

*Ready to take your freelance design career to the next level? Let''s discuss how we can help you achieve your goals.*', '/img/blog/freelance-design-tips.jpg', 'Freelancing', ARRAY['freelancing', 'design career', 'business tips', 'Istanbul', 'creative business'], true, NOW(), 'Freelance Design Success Tips from Istanbul Designer', 'Learn valuable insights for building a successful freelance design career. Practical tips from an experienced designer in Istanbul''s competitive market.', 12, 1560)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES (if using Supabase Storage)
-- ============================================================================

-- Enable storage for public access to images
-- Note: You may need to create storage buckets manually in the Supabase dashboard

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- This will show a success message when the script completes
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup completed successfully!';
  RAISE NOTICE '📊 Tables created: projects, skills, testimonials, blog_posts, blog_categories';
  RAISE NOTICE '🔐 RLS policies configured for security';
  RAISE NOTICE '📝 Sample data inserted';
  RAISE NOTICE '🚀 Your portfolio website is ready to use!';
END $$; 