import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  let formData: any = null;
  
  try {
    formData = await request.json();
    
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
    
    // Determine if this is a header form or contact form submission
    const isHeaderForm = formData.formType === 'header';
    
    // Email content
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
          <p><strong>Project Type:</strong> ${formData.projectType}</p>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
          <h3>Message:</h3>
          <p>${formData.message.replace(/\n/g, '<br>')}</p>
        `,
    };
    
    try {
      console.log('Attempting to send email...');
      console.log('Mail options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        textLength: mailOptions.text?.length,
        htmlLength: mailOptions.html?.length
      });
      
      // Send email
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result);
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
