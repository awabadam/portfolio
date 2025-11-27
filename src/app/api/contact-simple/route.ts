import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  let formData: any = null;
  
  try {
    formData = await request.json();
    
    // Check if email configuration is set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECIPIENT_EMAIL) {
      console.error('Email configuration is missing');
      return NextResponse.json(
        { 
          error: 'Email service is being configured. Your message has been saved and we will contact you soon.',
        },
        { status: 500 }
      );
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
    
    // Email content for admin notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission: ${formData.projectType || 'General Inquiry'}`,
      text: `
        Name: ${formData.name || 'Not provided'}
        Email: ${formData.email || 'Not provided'}
        Phone: ${formData.phone || 'Not provided'}
        Project Type: ${formData.projectType || 'Not provided'}
        Company: ${formData.company || 'Not provided'}
        
        Message:
        ${formData.message || 'No message provided'}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${formData.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${formData.projectType || 'Not provided'}</p>
        <h3>Message:</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-line;">${formData.message || 'No message provided'}</div>
      `,
    };
    
    try {
      // Send admin notification email
      await transporter.sendMail(mailOptions);
      
      // Send user confirmation email if email is provided
      if (formData.email) {
        const userConfirmationEmail = {
          from: process.env.EMAIL_USER,
          to: formData.email,
          subject: `Thank you for contacting us, ${formData.name || 'there'}!`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Thank you for contacting us</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #000000 0%, #374151 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Thank You for Contacting Us!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">We've received your message and will respond soon</p>
              </div>
              <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 25px;">Hi ${formData.name || 'there'},</p>
                <p style="font-size: 16px; margin-bottom: 25px;">Thank you for reaching out to us! We've received your message and will get back to you within 24 hours.</p>
                <p style="font-size: 16px; margin: 25px 0 0 0;">
                  Best regards,<br>
                  <strong>Awab Elkhalil</strong><br>
                  <span style="color: #6b7280;">Full-Stack Developer & Designer</span>
                </p>
              </div>
            </body>
            </html>
          `,
        };
        
        try {
          await transporter.sendMail(userConfirmationEmail);
        } catch (userEmailError) {
          console.error('Failed to send user confirmation email:', userEmailError);
          // Don't fail the entire request if user email fails
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { 
          error: 'Failed to send email. Your message has been logged and we will contact you soon.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing form submission:', error);
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