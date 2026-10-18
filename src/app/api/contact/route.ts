import { NextResponse } from 'next/server';
import { createEmailTransport } from '@/lib/email';
import { db } from "@/db";
import { leads } from "@/db/schema";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { buildAdminContactAlert } from "@/emails/AdminContactAlert";
import { buildContactConfirmationEmail } from "@/emails/ContactConfirmation";

// Email template functions
/**
 * Locale for the confirmation email: body.locale when valid, else the
 * language prefix of the page that posted the form (Referer), else English.
 */
function detectLocale(request: Request, bodyLocale: unknown): Locale {
  if (typeof bodyLocale === "string" && (locales as readonly string[]).includes(bodyLocale)) {
    return bodyLocale as Locale;
  }
  try {
    const referer = request.headers.get("referer");
    if (referer) {
      const first = new URL(referer).pathname.split("/")[1] ?? "";
      if ((locales as readonly string[]).includes(first)) return first as Locale;
    }
  } catch {
    // Malformed Referer: fall through.
  }
  return defaultLocale;
}

export async function POST(request: Request) {
  let formData: any = null;
  
  try {
    formData = await request.json();
    const locale = detectLocale(request, formData?.locale);
    let leadId: string | null = null;
    
    // Save lead to database
    try {
      const headers = request.headers;
      const ipAddress = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown";
      const userAgent = headers.get("user-agent") || "unknown";
      
      const [row] = await db.insert(leads).values({
        source: 'contact_form',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        project_type: formData.projectType,
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata: {
          company: formData.company,
          formType: formData.formType,
          locale,
        },
      }).returning({ id: leads.id });
      leadId = row?.id ?? null;
    } catch (leadError) {
      console.error("Error saving lead:", leadError);
      // Continue even if lead saving fails
    }
    
    // Debug: Log environment variables (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Environment variables check:');
      console.log('EMAIL_HOST:', process.env.EMAIL_HOST ? 'Set' : 'Missing');
      console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
      console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Missing');
      console.log('RECIPIENT_EMAIL:', process.env.RECIPIENT_EMAIL ? 'Set' : 'Missing');
      console.log('NODE_ENV:', process.env.NODE_ENV);
    }
    
    // Check if email configuration is set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECIPIENT_EMAIL) {
      console.error('Email configuration is missing. Please check your .env file.');
      
      // Store the form data for later processing
      const formDataLog = {
        timestamp: new Date().toISOString(),
        formType: formData.formType || 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType,
        message: formData.message,
        status: 'pending_email_config'
      };
      
      console.log('Form submission (email config missing):', formDataLog);
      
      return NextResponse.json(
        { 
          error: 'Email service is being configured. Your message has been saved and we will contact you soon.',
          details: process.env.NODE_ENV === 'development' ? 
            'Missing email configuration. Please set up EMAIL_HOST, EMAIL_USER, EMAIL_PASS, and RECIPIENT_EMAIL in your .env.local file.' : undefined
        },
        { status: 500 }
      );
    }
    
    // Create transporter (shared SMTP config lives in src/lib/email.ts)
    const transporter = createEmailTransport();
    
    // Verify SMTP connection (optional - can skip if causing issues)
    if (process.env.NODE_ENV === 'development') {
      try {
        await transporter.verify();
        console.log('SMTP connection verified successfully');
      } catch (verifyError) {
        console.error('SMTP connection verification failed:', verifyError);
        console.log('Continuing without verification...');
        // Don't throw error, just log it and continue
      }
    }
    
    // Determine form type: the header and hero forms only collect an email
    // (name and message are canned), so the lead gets no message quote.
    const isHeaderForm = formData.formType === 'header';
    const isOneField = isHeaderForm || formData.formType === 'hero';

    // Email content for admin notification (HTML + text, see src/emails/AdminContactAlert.tsx)
    const admin = await buildAdminContactAlert({
      formType: formData.formType,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      projectType: formData.projectType,
      message: formData.message,
      locale,
      leadId,
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      replyTo: formData.email || undefined,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
    };
    
    try {
      console.log('Attempting to send admin notification email...');
      
      // Send admin notification email
      const adminResult = await transporter.sendMail(mailOptions);
      console.log('Admin notification email sent successfully:', adminResult);
      
      // Send user confirmation email (for regular contact forms, not header forms)
      if (!isHeaderForm && formData.email) {
        try {
          const confirmation = await buildContactConfirmationEmail({
            locale,
            name: isOneField ? null : formData.name,
            message: isOneField ? null : formData.message,
          });
          const userResult = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: formData.email,
            replyTo: process.env.RECIPIENT_EMAIL,
            subject: confirmation.subject,
            text: confirmation.text,
            html: confirmation.html,
          });
          console.log('User confirmation email sent successfully:', userResult);
        } catch (userEmailError) {
          console.error('Failed to send user confirmation email:', userEmailError);
          // Don't fail the entire request if user email fails
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        code: (error as any)?.code,
        command: (error as any)?.command,
        responseCode: (error as any)?.responseCode,
        response: (error as any)?.response
      });
      
      // Store the form data in a log file or database as a fallback
      const formDataLog = {
        timestamp: new Date().toISOString(),
        formType: formData.formType || 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType,
        message: formData.message,
      };
      
      console.log('Form submission (email failed):', formDataLog);
      
      return NextResponse.json(
        { 
          error: 'Failed to send email. Your message has been logged and we will contact you soon.',
          details: process.env.NODE_ENV === 'development' ? 
            (error instanceof Error ? error.message : String(error)) : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Log detailed error information
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      formData: formData || 'No form data available'
    };
    
    console.log('Detailed error information:', errorDetails);
    
    return NextResponse.json(
      { 
        error: 'Failed to process form submission',
        details: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
