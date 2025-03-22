import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    // Check if email configuration is set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECIPIENT_EMAIL) {
      console.error('Email configuration is missing. Please check your .env file.');
      return NextResponse.json(
        { error: 'Email configuration is missing. Please check your .env file.' },
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
    });
    
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
      // Send email
      await transporter.sendMail(mailOptions);
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
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
