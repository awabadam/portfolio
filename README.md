This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

## Email Configuration

This project includes a contact form that sends emails. To set up the email functionality:

1. Configure your `.env` file with the following variables:

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

When deploying to Vercel, add the email environment variables in the Vercel project settings.
