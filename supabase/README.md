# Supabase Integration

This directory contains files related to the Supabase integration for the portfolio project.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Note your project URL and anon key (public API key)

### 2. Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Set Up Database Schema

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy the contents of `schema.sql` from this directory
3. Paste it into a new SQL query in the SQL Editor
4. Run the query to create the necessary tables and security policies

## Database Schema

The database includes the following tables:

### Projects

Stores portfolio project information:

- `id`: UUID primary key
- `title`: Project title
- `category`: Project category (e.g., Web Design, Branding)
- `description`: Project description
- `behance_url`: URL to the Behance project
- `thumbnail_url`: URL to the project thumbnail image
- `images`: Array of image URLs for the project
- `featured`: Boolean indicating if the project is featured
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update
- `user_id`: Reference to the user who created the project

### Skills

Stores skill information:

- `id`: UUID primary key
- `name`: Skill name
- `category`: Skill category (e.g., Design, Development)
- `proficiency`: Integer from 0-100 indicating proficiency level
- `icon`: Icon identifier or URL
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update
- `user_id`: Reference to the user who created the skill

### Testimonials

Stores client testimonials:

- `id`: UUID primary key
- `name`: Client name
- `position`: Client position
- `company`: Client company
- `content`: Testimonial content
- `avatar_url`: URL to the client's avatar
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update
- `user_id`: Reference to the user who created the testimonial

## Row Level Security (RLS)

The schema includes Row Level Security policies:

- Everyone can view projects, skills, and testimonials
- Only authenticated users can insert, update, or delete their own data

## Authentication

Supabase provides authentication out of the box. This project uses email/password authentication, but you can enable additional providers (Google, GitHub, etc.) in the Supabase dashboard.

## Storage

For storing images, you can use Supabase Storage:

1. Create a new bucket in the Supabase dashboard
2. Set up appropriate security policies
3. Use the Supabase client to upload and retrieve files

Example:

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from("projects")
  .upload("project-image.jpg", file);

// Get public URL
const { data } = supabase.storage
  .from("projects")
  .getPublicUrl("project-image.jpg");
```
