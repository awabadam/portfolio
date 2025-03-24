-- Add case study fields to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS overview TEXT,
ADD COLUMN IF NOT EXISTS objectives TEXT[],
ADD COLUMN IF NOT EXISTS approach TEXT[],
ADD COLUMN IF NOT EXISTS design_concept TEXT,
ADD COLUMN IF NOT EXISTS final_thoughts TEXT;
