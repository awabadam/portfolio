import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createAppServerClient } from "@/lib/supabase/server-app";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    // Save lead to database
    try {
      const headers = request.headers;
      const ipAddress = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown";
      const userAgent = headers.get("user-agent") || "unknown";
      
      const supabase = createAppServerClient();
      await supabase.from("leads").insert({
        source: "newsletter",
        email: email,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
    } catch (leadError) {
      console.error("Error saving newsletter lead:", leadError);
      // Continue even if lead saving fails
    }

    // Check if email configuration is set
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      !process.env.RECIPIENT_EMAIL
    ) {
      console.error("Email configuration is missing");
      return NextResponse.json(
        {
          error:
            "Newsletter service is being configured. Please try again later.",
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

    // Send admin notification
    const adminEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: "New Newsletter Subscription",
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    // Send user confirmation email
    const userEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Our Newsletter</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #000000 0%, #374151 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Welcome to Our Newsletter!</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 25px;">Thank you for subscribing to our newsletter!</p>
            <p style="font-size: 16px; margin-bottom: 25px;">You'll now receive the latest web design trends, SEO tips, and industry insights delivered directly to your inbox.</p>
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
      // Send both emails
      await Promise.all([
        transporter.sendMail(adminEmail),
        transporter.sendMail(userEmail),
      ]);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error sending newsletter emails:", error);
      return NextResponse.json(
        {
          error: "Failed to process subscription. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing newsletter subscription:", error);
    return NextResponse.json(
      {
        error: "Failed to process subscription",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}

