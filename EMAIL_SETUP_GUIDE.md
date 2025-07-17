# Email Setup Guide - Contact Form Fix

## Problem

The contact form is showing "Failed to send email. Your message has been logged and we will contact you soon." This happens because the email configuration environment variables are not set up.

## Solution Options

### Option 1: Gmail SMTP Setup (Recommended for Development)

#### 1. Create Environment File

Create a `.env.local` file in your project root:

```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECIPIENT_EMAIL=awabe.adam@gmail.com

# Optional: Development mode
NODE_ENV=development
```

#### 2. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Use this password in `EMAIL_PASS`

#### 3. Test Configuration

```bash
npm run dev
# Test the contact form
```

### Option 2: Professional Email Service (Recommended for Production)

#### 1. Resend.com (Free Tier Available)

```bash
# Install Resend
npm install resend

# Environment variables
RESEND_API_KEY=your-resend-api-key
RECIPIENT_EMAIL=awabe.adam@gmail.com
```

#### 2. SendGrid (Free Tier Available)

```bash
# Install SendGrid
npm install @sendgrid/mail

# Environment variables
SENDGRID_API_KEY=your-sendgrid-api-key
RECIPIENT_EMAIL=awabe.adam@gmail.com
```

#### 3. Mailgun (Free Tier Available)

```bash
# Environment variables
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-domain.com
RECIPIENT_EMAIL=awabe.adam@gmail.com
```

### Option 3: Supabase Edge Functions (Recommended for Your Setup)

Since you're already using Supabase, you can use Supabase Edge Functions for email:

#### 1. Create Supabase Edge Function

```bash
# In your supabase/functions directory
supabase functions new send-email
```

#### 2. Edge Function Code

```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

const client = new SmtpClient();

serve(async (req) => {
  try {
    const { email, name, message, projectType } = await req.json();

    await client.connectTLS({
      hostname: Deno.env.get("SMTP_HOST") || "smtp.gmail.com",
      port: 587,
      username: Deno.env.get("SMTP_USER"),
      password: Deno.env.get("SMTP_PASS"),
    });

    await client.send({
      from: Deno.env.get("SMTP_USER"),
      to: Deno.env.get("RECIPIENT_EMAIL"),
      subject: `New Contact Form Submission: ${projectType}`,
      content: `
        Name: ${name}
        Email: ${email}
        Project Type: ${projectType}
        Message: ${message}
      `,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

#### 3. Deploy Function

```bash
supabase functions deploy send-email
```

#### 4. Update API Route

```typescript
// src/app/api/contact/route.ts
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const supabase = createClient();

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: formData,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
```

## Quick Fix for Immediate Testing

### 1. Create .env.local File

```bash
# Create .env.local in your project root
touch .env.local
```

### 2. Add Basic Configuration

```env
# .env.local
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECIPIENT_EMAIL=awabe.adam@gmail.com
```

### 3. Restart Development Server

```bash
npm run dev
```

## Environment Variables Reference

| Variable          | Description                       | Example                |
| ----------------- | --------------------------------- | ---------------------- |
| `EMAIL_HOST`      | SMTP server hostname              | `smtp.gmail.com`       |
| `EMAIL_PORT`      | SMTP server port                  | `587`                  |
| `EMAIL_USER`      | Your email address                | `your-email@gmail.com` |
| `EMAIL_PASS`      | Your email password/app password  | `your-app-password`    |
| `RECIPIENT_EMAIL` | Where to send contact form emails | `awabe.adam@gmail.com` |

## Testing the Setup

### 1. Local Testing

```bash
# Start development server
npm run dev

# Test contact form
# Fill out the form and submit
# Check console for any errors
```

### 2. Production Testing

```bash
# Deploy to Vercel
vercel --prod

# Test the live form
# Check Vercel function logs for errors
```

## Troubleshooting

### Common Issues

1. **"Email configuration is missing"**

   - Check that `.env.local` file exists
   - Verify all required variables are set
   - Restart development server

2. **"Authentication failed"**

   - Check email/password combination
   - For Gmail, use App Password, not regular password
   - Enable "Less secure app access" (not recommended)

3. **"Connection timeout"**
   - Check firewall settings
   - Verify SMTP host and port
   - Try different email provider

### Debug Commands

```bash
# Check environment variables
echo $EMAIL_HOST
echo $EMAIL_USER

# Test SMTP connection
telnet smtp.gmail.com 587
```

## Security Best Practices

### 1. Environment Variables

- Never commit `.env` files to git
- Use different credentials for development/production
- Rotate passwords regularly

### 2. Email Security

- Use App Passwords instead of regular passwords
- Enable 2-Factor Authentication
- Use TLS/SSL connections

### 3. Rate Limiting

Consider adding rate limiting to prevent spam:

```typescript
// Add to your API route
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});
```

## Recommended Setup for Production

### 1. Use Professional Email Service

- **Resend.com**: Free tier, great deliverability
- **SendGrid**: Reliable, good free tier
- **Mailgun**: Developer-friendly

### 2. Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required email variables

### 3. Monitor and Log

- Set up email delivery monitoring
- Log failed attempts
- Set up alerts for issues

This setup will fix your contact form and ensure reliable email delivery for your portfolio website.
