import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    EMAIL_HOST: process.env.EMAIL_HOST ? 'Set' : 'Missing',
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing',
    RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL ? 'Set' : 'Missing',
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
} 