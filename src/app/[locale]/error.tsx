"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">{t('heading')}</h2>
        <p className="mb-6 text-muted-foreground">
          {t('description')}
        </p>
        <Button onClick={reset}>{t('tryAgain')}</Button>
      </div>
    </div>
  );
}
