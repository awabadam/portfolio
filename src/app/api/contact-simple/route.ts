import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    console.log('=== CONTACT FORM DEBUG ===');
    console.log('Form data received:', formData);
    console.log('Environment variables:');
    console.log('- EMAIL_HOST:', process.env.EMAIL_HOST ? 'Set' : 'Missing');
    console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
    console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Missing');
    console.log('- RECIPIENT_EMAIL:', process.env.RECIPIENT_EMAIL ? 'Set' : 'Missing');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    // Check if email configuration is set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECIPIENT_EMAIL) {
      console.log('❌ Email configuration missing');
      return NextResponse.json(
        { 
          error: 'Email configuration missing',
          debug: {
            EMAIL_HOST: !!process.env.EMAIL_HOST,
            EMAIL_USER: !!process.env.EMAIL_USER,
            EMAIL_PASS: !!process.env.EMAIL_PASS,
            RECIPIENT_EMAIL: !!process.env.RECIPIENT_EMAIL,
          }
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Email configuration found');
    
    // For now, just return success without sending email
    // This will help us identify if the issue is with the API route or email sending
    console.log('✅ API route working correctly');
    
    return NextResponse.json({ 
      success: true,
      message: 'Form received successfully (email sending disabled for debugging)',
      debug: {
        formType: formData.formType,
        email: formData.email,
        name: formData.name,
        projectType: formData.projectType
      }
    });
    
  } catch (error) {
    console.error('❌ Error in contact API:', error);
    return NextResponse.json(
      { 
        error: 'API route error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 