import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Missing',
    RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL ? 'Set' : 'Missing',
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
