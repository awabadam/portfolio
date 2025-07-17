# Email Form Troubleshooting Guide

## Problem

Even though `.env` file is set up correctly, the contact form still shows "Failed to send email" error.

## Common Causes & Solutions

### 1. Environment Variable Loading Issues

#### **Issue**: Variables not being loaded properly

**Solution**: Check file naming and location

```bash
# Ensure file is named correctly
.env.local          # ✅ Correct for local development
.env                # ❌ May not be loaded by Next.js
.env.development    # ❌ May not be loaded by Next.js

# File should be in project root (same level as package.json)
```

#### **Issue**: Variables not available in production

**Solution**: Set environment variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all email variables:
   - `EMAIL_HOST`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `RECIPIENT_EMAIL`

### 2. Gmail Authentication Issues

#### **Issue**: "Invalid login" or "Authentication failed"

**Solutions**:

1. **Use App Password (Recommended)**

   ```bash
   # Don't use your regular Gmail password
   EMAIL_PASS=your-regular-password  # ❌ Won't work
   EMAIL_PASS=abcd efgh ijkl mnop    # ✅ App password
   ```

2. **Enable 2-Factor Authentication**

   - Go to Google Account settings
   - Security → 2-Step Verification → Turn on

3. **Generate App Password**

   - Go to Google Account settings
   - Security → App passwords
   - Select "Mail" and generate password

4. **Enable "Less secure app access" (Not recommended)**
   - Only if you can't use App Passwords
   - Less secure and may be blocked

#### **Issue**: "Username and Password not accepted"

**Solution**: Check email format

```bash
# Use full email address
EMAIL_USER=your-email@gmail.com  # ✅ Correct
EMAIL_USER=your-email            # ❌ Missing domain
```

### 3. SMTP Connection Issues

#### **Issue**: Connection timeout

**Solutions**:

1. **Check SMTP settings**

   ```bash
   # Gmail SMTP settings
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. **Try different ports**

   ```bash
   EMAIL_PORT=587  # ✅ Standard TLS
   EMAIL_PORT=465  # ✅ SSL
   EMAIL_PORT=25   # ❌ Often blocked
   ```

3. **Check firewall/network**
   - Some networks block SMTP ports
   - Try from different network
   - Check if port 587 is open

#### **Issue**: "Connection refused"

**Solution**: Check hostname

```bash
# Gmail
EMAIL_HOST=smtp.gmail.com  # ✅ Correct

# Outlook/Hotmail
EMAIL_HOST=smtp-mail.outlook.com

# Yahoo
EMAIL_HOST=smtp.mail.yahoo.com
```

### 4. Next.js Environment Variable Issues

#### **Issue**: Variables not available in API routes

**Solution**: Restart development server

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

#### **Issue**: Variables not loaded in production

**Solution**: Check Vercel environment variables

```bash
# In Vercel Dashboard, verify:
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECIPIENT_EMAIL=awabe.adam@gmail.com
```

### 5. Nodemailer Configuration Issues

#### **Issue**: Transport creation fails

**Solution**: Check nodemailer configuration

```typescript
// Enhanced configuration with error handling
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add timeout settings
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});
```

### 6. Testing and Debugging

#### **Step 1: Check Environment Variables**

```bash
# Add this to your API route for debugging
console.log('Environment variables check:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST ? 'Set' : 'Missing');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Missing');
console.log('RECIPIENT_EMAIL:', process.env.RECIPIENT_EMAIL ? 'Set' : 'Missing');
```

#### **Step 2: Test SMTP Connection**

```typescript
// Add this to your API route
try {
  await transporter.verify();
  console.log("SMTP connection verified successfully");
} catch (error) {
  console.error("SMTP connection failed:", error);
}
```

#### **Step 3: Check Console Logs**

```bash
# In development, check terminal for errors
npm run dev

# In production, check Vercel function logs
# Go to Vercel Dashboard → Functions → View Logs
```

### 7. Alternative Solutions

#### **Option 1: Use Professional Email Service**

```bash
# Resend.com (Recommended)
npm install resend

# Environment variables
RESEND_API_KEY=your-api-key
RECIPIENT_EMAIL=awabe.adam@gmail.com
```

#### **Option 2: Use Supabase Edge Functions**

```typescript
// Create Supabase Edge Function for email
// This avoids SMTP issues entirely
```

#### **Option 3: Use Vercel's Built-in Email**

```typescript
// Use Vercel's email service
// No SMTP configuration needed
```

### 8. Quick Diagnostic Steps

#### **Step 1: Verify Environment Variables**

```bash
# Create a test API route
// app/api/test-env/route.ts
export async function GET() {
  return Response.json({
    EMAIL_HOST: process.env.EMAIL_HOST ? 'Set' : 'Missing',
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing',
    RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL ? 'Set' : 'Missing',
  });
}
```

#### **Step 2: Test SMTP Connection**

```bash
# Use telnet to test SMTP connection
telnet smtp.gmail.com 587
```

#### **Step 3: Check Gmail Settings**

1. Go to Gmail settings
2. Check if "Less secure app access" is enabled
3. Verify 2-Factor Authentication is set up
4. Generate new App Password

### 9. Common Error Messages & Solutions

| Error Message           | Cause              | Solution                               |
| ----------------------- | ------------------ | -------------------------------------- |
| "Invalid login"         | Wrong password     | Use App Password, not regular password |
| "Connection timeout"    | Network/firewall   | Try different network or port          |
| "Authentication failed" | 2FA enabled        | Generate App Password                  |
| "Username not accepted" | Wrong email format | Use full email address                 |
| "Connection refused"    | Wrong hostname     | Check SMTP host settings               |

### 10. Production Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] App Password generated for Gmail
- [ ] 2-Factor Authentication enabled
- [ ] SMTP settings verified
- [ ] Test email sent successfully
- [ ] Error logging configured
- [ ] Rate limiting implemented

This troubleshooting guide should help identify and fix the email form issue. Start with the diagnostic steps and work through the common causes systematically.
