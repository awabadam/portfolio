-- ============================================================================
-- COMPLETE SETUP FOR NEW SUPABASE PROJECT
-- Run this entire file in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

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
-- BLOG SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count ON blog_posts(view_count);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Published posts visible to everyone
CREATE POLICY "Published blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Authenticated users can see all posts (including drafts) in admin
CREATE POLICY "Authenticated users can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Anyone can insert blog posts (needed for cron job / API route)
CREATE POLICY "Anyone can insert blog posts"
  ON blog_posts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can update/delete
CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Blog categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON blog_categories(name);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog categories are viewable by everyone"
  ON blog_categories FOR SELECT
  USING (true);

CREATE TRIGGER update_blog_categories_updated_at
BEFORE UPDATE ON blog_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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
-- LEADS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('whatsapp', 'contact_form', 'newsletter', 'chat', 'rate_calculator')),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  project_type TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leads are viewable by authenticated users"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CHAT SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  ip_address TEXT,
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat conversations viewable by authenticated"
  ON chat_conversations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can create chat conversations"
  ON chat_conversations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update chat conversations"
  ON chat_conversations FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Chat messages viewable by authenticated"
  ON chat_messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can create chat messages"
  ON chat_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON chat_conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DONE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Setup complete: blog_posts, blog_categories, leads, chat_conversations, chat_messages';
END $$;
