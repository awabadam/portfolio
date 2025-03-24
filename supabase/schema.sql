-- Create tables for the portfolio application

-- Projects table
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
  user_id UUID REFERENCES auth.users(id)
);

-- Create RLS (Row Level Security) policies for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to projects
CREATE POLICY "Projects are viewable by everyone" 
  ON projects FOR SELECT 
  USING (true);

-- Policy for authenticated users to insert their own projects
CREATE POLICY "Users can insert their own projects" 
  ON projects FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own projects
CREATE POLICY "Users can update their own projects" 
  ON projects FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Policy for authenticated users to delete their own projects
CREATE POLICY "Users can delete their own projects" 
  ON projects FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Skills table
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

-- Create RLS policies for skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to skills
CREATE POLICY "Skills are viewable by everyone" 
  ON skills FOR SELECT 
  USING (true);

-- Policy for authenticated users to insert their own skills
CREATE POLICY "Users can insert their own skills" 
  ON skills FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own skills
CREATE POLICY "Users can update their own skills" 
  ON skills FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Policy for authenticated users to delete their own skills
CREATE POLICY "Users can delete their own skills" 
  ON skills FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create a trigger to automatically update the updated_at column for skills
CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON skills
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Testimonials table
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

-- Create RLS policies for testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to testimonials
CREATE POLICY "Testimonials are viewable by everyone" 
  ON testimonials FOR SELECT 
  USING (true);

-- Policy for authenticated users to insert their own testimonials
CREATE POLICY "Users can insert their own testimonials" 
  ON testimonials FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own testimonials
CREATE POLICY "Users can update their own testimonials" 
  ON testimonials FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Policy for authenticated users to delete their own testimonials
CREATE POLICY "Users can delete their own testimonials" 
  ON testimonials FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create a trigger to automatically update the updated_at column for testimonials
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
