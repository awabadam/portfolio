-- Fix Blog Posts CRUD Operations
-- Run this in your Supabase SQL Editor

-- First, let's check if the blog_posts table exists and has the right structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY ordinal_position;

-- Check current RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'blog_posts';

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Users can insert their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can update their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can delete their own blog posts" ON blog_posts;

-- Enable RLS if not already enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for all operations
-- 1. SELECT policy - allow reading published posts by everyone, all posts by authenticated users
CREATE POLICY "Allow reading blog posts" 
  ON blog_posts FOR SELECT 
  USING (
    published = true 
    OR auth.role() = 'authenticated'
  );

-- 2. INSERT policy - allow authenticated users to insert posts
CREATE POLICY "Allow authenticated users to insert blog posts" 
  ON blog_posts FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = author_id OR author_id IS NULL);

-- 3. UPDATE policy - allow users to update their own posts or posts with NULL author_id (sample data)
CREATE POLICY "Allow users to update blog posts" 
  ON blog_posts FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = author_id OR author_id IS NULL);

-- 4. DELETE policy - allow users to delete their own posts or posts with NULL author_id (sample data)
CREATE POLICY "Allow users to delete blog posts" 
  ON blog_posts FOR DELETE 
  TO authenticated 
  USING (auth.uid() = author_id OR author_id IS NULL);

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'blog_posts';

-- Test query to see if we can read posts
SELECT COUNT(*) as total_posts FROM blog_posts;

-- Show sample posts to verify they exist
SELECT id, title, author_id, published FROM blog_posts LIMIT 5; 