"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Mail, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const formType = searchParams.get("type");
  const name = searchParams.get("name");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const isQuoteRequest = formType === "quote";

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
          </div>

          {/* Main Heading */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
            {isQuoteRequest
              ? "Quote Request Sent!"
              : "Message Sent Successfully!"}
          </h1>

          {/* Personalized message */}
          {name && (
            <p className="mb-6 text-xl text-gray-700 dark:text-gray-300">
              Thank you{name ? `, ${decodeURIComponent(name)}` : ""}!
            </p>
          )}

          {/* Main description */}
          <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {isQuoteRequest
              ? "Your website quote request has been received. I'll review your project details and send you a detailed proposal within 2 hours."
              : "Thank you for reaching out! I've received your message and will get back to you within 24 hours."}
          </p>

          {/* Information Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            {/* Response Time */}
            <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <Clock className="mx-auto mb-3 h-8 w-8 text-gray-600 dark:text-gray-300" />
                <h3 className="mb-2 font-semibold text-black dark:text-white">
                  Quick Response
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isQuoteRequest ? "2 hours or less" : "Within 24 hours"}
                </p>
              </CardContent>
            </Card>

            {/* Email Confirmation */}
            <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <Mail className="mx-auto mb-3 h-8 w-8 text-gray-600 dark:text-gray-300" />
                <h3 className="mb-2 font-semibold text-black dark:text-white">
                  Check Your Email
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Confirmation sent to your inbox
                </p>
              </CardContent>
            </Card>

            {/* Direct Contact */}
            <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <Phone className="mx-auto mb-3 h-8 w-8 text-gray-600 dark:text-gray-300" />
                <h3 className="mb-2 font-semibold text-black dark:text-white">
                  Need to Talk?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Feel free to call directly
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quote-specific information */}
          {isQuoteRequest && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                What Happens Next?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    I'll review your project details and pricing requirements
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    You'll receive a detailed quote with project breakdown via
                    email
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    We can schedule a free 15-minute consultation call to
                    discuss your vision
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    If approved, we can start your project within 1-2 business
                    days
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/projects">View My Work</Link>
            </Button>
          </div>

          {/* Additional Note */}
          <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            Don't forget to check your spam folder for the confirmation email.
            <br />
            If you have any urgent questions, feel free to contact me directly.
          </p>
        </div>
      </div>
    </main>
  );
}
