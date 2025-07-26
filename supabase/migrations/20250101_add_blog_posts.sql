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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Create RLS policies for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published blog posts
CREATE POLICY "Published blog posts are viewable by everyone" 
  ON blog_posts FOR SELECT 
  USING (published = true);

-- Policy for authenticated users to insert their own blog posts
CREATE POLICY "Users can insert their own blog posts" 
  ON blog_posts FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = author_id);

-- Policy for authenticated users to update their own blog posts
CREATE POLICY "Users can update their own blog posts" 
  ON blog_posts FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = author_id);

-- Policy for authenticated users to delete their own blog posts
CREATE POLICY "Users can delete their own blog posts" 
  ON blog_posts FOR DELETE 
  TO authenticated 
  USING (auth.uid() = author_id);

-- Create a trigger to automatically update the updated_at column for blog_posts
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create blog_categories table for better organization
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to automatically update the updated_at column for blog_categories
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