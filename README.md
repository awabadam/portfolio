# Portfolio Website

This is a [Next.js](https://nextjs.org/) portfolio website with Supabase integration for data storage, authentication, and content management.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Supabase Integration

This project uses [Supabase](https://supabase.com/) for:

- **Database**: Store projects, skills, testimonials, and other content
- **Authentication**: User login and registration
- **Storage**: Upload and manage images and files
- **API**: Serverless functions for data operations

### Setup Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com/)
2. Add your Supabase URL and anon key to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Set up the database schema:
   - Navigate to the SQL Editor in your Supabase dashboard
   - Run the SQL script from `supabase/schema.sql`

For detailed instructions, see [supabase/README.md](./supabase/README.md).

## Email Configuration

This project includes a contact form that sends emails. To set up the email functionality:

1. Configure your `.env.local` file with the following variables:

```
# Email Configuration
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password-or-smtp-password
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
RECIPIENT_EMAIL=where-to-receive@example.com
```

2. Email service provider options:

   - **Gmail**: Use `smtp.gmail.com` as the host. If you have 2FA enabled, you'll need to create an App Password.
   - **Outlook/Office 365**: Use `smtp.office365.com` as the host.
   - **SendGrid**: Use `smtp.sendgrid.net` as the host with your SendGrid credentials.

3. When deploying, make sure to set these environment variables in your hosting platform.

## Project Structure

- `src/app`: Next.js app router pages and API routes
- `src/components`: React components
- `src/lib/supabase`: Supabase client configuration
- `src/lib/hooks`: Custom React hooks
- `src/data`: Data fetching functions
- `supabase`: Supabase configuration and schema

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

When deploying to Vercel:

1. Add the email environment variables in the Vercel project settings
2. Add the Supabase environment variables in the Vercel project settings
3. Set up the integration between Vercel and Supabase for improved performance
