"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Mail, Clock, Phone } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useSearchParams } from "next/navigation";
import { useTranslations } from 'next-intl';

export default function ThankYouPage() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const formType = searchParams.get("type");
  const name = searchParams.get("name");
  const t = useTranslations('thankYou');

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
              ? t('quoteHeading')
              : t('contactHeading')}
          </h1>

          {/* Personalized message */}
          {name && (
            <p className="mb-6 text-xl text-gray-700 dark:text-gray-300">
              {t('personalGreeting', { name: decodeURIComponent(name) })}
            </p>
          )}

          {/* Main description */}
          <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {isQuoteRequest
              ? t('quoteDescription')
              : t('contactDescription')}
          </p>

          {/* Information Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            {/* Response Time */}
            <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <Clock className="mx-auto mb-3 h-8 w-8 text-gray-600 dark:text-gray-300" />
                <h3 className="mb-2 font-semibold text-black dark:text-white">
                  {t('quickResponse')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isQuoteRequest ? t('quoteResponseTime') : t('contactResponseTime')}
                </p>
              </CardContent>
            </Card>

            {/* Email Confirmation */}
            <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <Mail className="mx-auto mb-3 h-8 w-8 text-gray-600 dark:text-gray-300" />
                <h3 className="mb-2 font-semibold text-black dark:text-white">
                  {t('checkEmail')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('confirmationSent')}
                </p>
              </CardContent>
            </Card>

            {/* Direct Contact */}
            <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <Phone className="mx-auto mb-3 h-8 w-8 text-gray-600 dark:text-gray-300" />
                <h3 className="mb-2 font-semibold text-black dark:text-white">
                  {t('needToTalk')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('callDirectly')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quote-specific information */}
          {isQuoteRequest && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                {t('whatNext')}
              </h3>
              <div className="space-y-3 text-left rtl:text-right">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('nextStep1')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('nextStep2')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('nextStep3')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-600 dark:bg-gray-400"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t('nextStep4')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">
                <ArrowLeft className="mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180 h-5 w-5" />
                {t('backHome')}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/projects">{t('viewWork')}</Link>
            </Button>
          </div>

          {/* Additional Note */}
          <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            {t('spamNote')}
          </p>
        </div>
      </div>
    </main>
  );
}
