import { Link } from '@/i18n/routing';
import React from "react";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description:
    "The page you are looking for doesn't exist or has been moved. Return to the homepage to explore our portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  const t = useTranslations('errors');

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold">{t('notFoundCode')}</h1>
      <h2 className="mt-4 text-2xl font-medium">{t('notFoundHeading')}</h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        {t('notFoundDescription')}
      </p>
      <Button asChild className="mt-8">
        <Link href="/">{t('returnHome')}</Link>
      </Button>
    </div>
  );
}
