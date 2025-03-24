-- Storage policies for project-images bucket

-- First, ensure the bucket exists (create it if it doesn't)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all objects in the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Users Can Update Own Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images' AND auth.uid() = owner);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users Can Delete Own Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images' AND auth.uid() = owner);
