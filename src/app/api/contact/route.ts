import { NextResponse } from 'next/server';
import { isEmailConfigured, sendEmail, NOTIFICATION_RECIPIENT, SENDERS } from '@/lib/email';
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
    
    // Check if email configuration is set
    if (!isEmailConfigured()) {
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
            'Missing email configuration. Please set RESEND_API_KEY and RECIPIENT_EMAIL in your .env.local file.' : undefined
        },
        { status: 500 }
      );
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
      to: NOTIFICATION_RECIPIENT(),
      replyTo: formData.email || undefined,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
    };
    
    try {
      console.log('Attempting to send admin notification email...');
      
      // Send admin notification email
      // sendEmail never throws; turn a failed send into the error path below
      const adminResult = await sendEmail(mailOptions);
      if (!adminResult.sent) throw new Error(adminResult.error);
      console.log('Admin notification email sent successfully');
      
      // Send user confirmation email (for regular contact forms, not header forms)
      if (!isHeaderForm && formData.email) {
        try {
          const confirmation = await buildContactConfirmationEmail({
            locale,
            name: isOneField ? null : formData.name,
            message: isOneField ? null : formData.message,
          });
          const userResult = await sendEmail({
            to: formData.email,
            replyTo: SENDERS.hello,
            subject: confirmation.subject,
            text: confirmation.text,
            html: confirmation.html,
          });
          if (!userResult.sent) throw new Error(userResult.error);
          console.log('User confirmation email sent successfully');
        } catch (userEmailError) {
          console.error('Failed to send user confirmation email:', userEmailError);
          // Don't fail the entire request if user email fails
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      
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
