import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API route is working' });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received data:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in test API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
