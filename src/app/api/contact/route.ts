import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from "@/db";
import { leads } from "@/db/schema";

// Email template functions
function generateContactConfirmationEmail(formData: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting us</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
             <!-- Header -->
       <div style="background: linear-gradient(135deg, #000000 0%, #374151 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
         <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Thank You for Contacting Us!</h1>
         <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">We've received your message and will respond soon</p>
       </div>
      
      <!-- Content -->
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        
        <p style="font-size: 16px; margin-bottom: 25px;">Hi ${formData.name},</p>
        
        <p style="font-size: 16px; margin-bottom: 25px;">Thank you for reaching out to us! We've received your message and will get back to you within 24 hours.</p>
        
                 <!-- Message Summary -->
         <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 25px; margin: 25px 0;">
           <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">📝 Your Message</h3>
          <p style="margin: 0; color: #374151; font-style: italic;">"${formData.message?.substring(0, 200)}${formData.message?.length > 200 ? '...' : ''}"</p>
        </div>
        
        <p style="font-size: 16px; margin: 25px 0;">In the meantime, feel free to check out our portfolio and recent projects on our website.</p>
        
        <p style="font-size: 16px; margin: 25px 0 0 0;">
          Best regards,<br>
          <strong>Awab Sheikh</strong><br>
          <span style="color: #6b7280;">Full-Stack Developer & Designer</span>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          This email was sent because you contacted us through our website.<br>
          If you didn't send this message, please ignore this email.
        </p>
      </div>
      
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  let formData: any = null;
  
  try {
    formData = await request.json();
    
    // Save lead to database
    try {
      const headers = request.headers;
      const ipAddress = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown";
      const userAgent = headers.get("user-agent") || "unknown";
      
      await db.insert(leads).values({
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
        },
      });
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
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add timeout and connection settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
    
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
    
    // Determine form type
    const isHeaderForm = formData.formType === 'header';

    // Email content for admin notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: isHeaderForm
        ? `Website Audit Request`
        : `New Contact Form Submission: ${formData.projectType} Project`,
      text: isHeaderForm
        ? `
          Website Audit Request
          
          Email: ${formData.email}
          
          This user has requested a free website audit & consultation.
        `
        : `
          Name: ${formData.name}
          Email: ${formData.email}
          Phone: ${formData.phone || 'Not provided'}
          Project Type: ${formData.projectType}
          Company: ${formData.company || 'Not provided'}
          
          Message:
          ${formData.message}
        `,
      html: isHeaderForm
        ? `
          <h2>Website Audit Request</h2>
          <p>A user has requested a free website audit & consultation.</p>
          <p><strong>Email:</strong> ${formData.email}</p>
        `
        : `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
          <p><strong>Project Type:</strong> ${formData.projectType}</p>
          <h3>Message:</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-line;">${formData.message}</div>
        `,
    };
    
    try {
      console.log('Attempting to send admin notification email...');
      
      // Send admin notification email
      const adminResult = await transporter.sendMail(mailOptions);
      console.log('Admin notification email sent successfully:', adminResult);
      
      // Send user confirmation email (for regular contact forms, not header forms)
      if (!isHeaderForm && formData.email) {
        const userConfirmationEmail = {
          from: process.env.EMAIL_USER,
          to: formData.email,
          subject: `Thank you for contacting us, ${formData.name}!`,
          html: generateContactConfirmationEmail(formData),
        };
        
        try {
          const userResult = await transporter.sendMail(userConfirmationEmail);
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
