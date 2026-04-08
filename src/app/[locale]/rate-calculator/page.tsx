"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calculator,
  ArrowRight,
  CheckCircle,
  Globe,
  Code,
  Zap,
  Mail,
  Layout,
  Bot,
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { FALLBACK_TRY_RATE, intlPriceMap, getPrice, formatPrice } from "@/lib/pricing";

interface CalculatorData {
  projectType: string;
  addOns: string[];
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  description?: string;
}

const projectTypesMeta = [
  { id: "landing", nameKey: "landingPage" as const, descKey: "landingPageDesc" as const, basePrice: 100, icon: <Globe className="h-5 w-5" /> },
  { id: "business", nameKey: "businessWebsite" as const, descKey: "businessWebsiteDesc" as const, basePrice: 300, icon: <Code className="h-5 w-5" />, popular: true },
  { id: "custom", nameKey: "customWebsite" as const, descKey: "customWebsiteDesc" as const, basePrice: 800, icon: <Layout className="h-5 w-5" /> },
];

const addOnsMeta = [
  { id: "seo", nameKey: "seoSetup" as const, price: 80, icon: <Zap className="h-4 w-4" /> },
  { id: "blog", nameKey: "blogSystem" as const, price: 80, icon: <Mail className="h-4 w-4" /> },
  { id: "cms", nameKey: "contentManagement" as const, price: 150, icon: <Code className="h-4 w-4" /> },
  { id: "chatbot", nameKey: "aiChatbotAddon" as const, price: 300, icon: <Bot className="h-4 w-4" /> },
  { id: "multilang", nameKey: "multiLanguage" as const, price: 100, icon: <Globe className="h-4 w-4" /> },
];


export default function RateCalculator() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("rateCalculator");
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    projectType: "",
    addOns: [],
    contactInfo: { name: "", email: "", phone: "" },
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tryRate, setTryRate] = useState(FALLBACK_TRY_RATE);

  useEffect(() => {
    if (locale === "tr") {
      fetch("/api/exchange-rate")
        .then((res) => res.json())
        .then((data) => { if (data.rate) setTryRate(data.rate); })
        .catch(() => {});
    }
  }, [locale]);

  const selectedProject = projectTypesMeta.find((p) => p.id === calculatorData.projectType);

  const basePrice = selectedProject ? getPrice(selectedProject.id, selectedProject.basePrice, locale) : 0;
  const addOnsCost = calculatorData.addOns.reduce((sum, addOnId) => {
    const addOn = addOnsMeta.find((a) => a.id === addOnId);
    return sum + (addOn ? getPrice(addOn.id, addOn.price, locale) : 0);
  }, 0);
  const total = basePrice + addOnsCost;

  const toggleAddOn = (addOnId: string) => {
    setCalculatorData((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter((id) => id !== addOnId)
        : [...prev.addOns, addOnId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculatorData.projectType) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const selectedAddOns = calculatorData.addOns
        .map((id) => addOnsMeta.find((a) => a.id === id))
        .filter(Boolean)
        .map((a) => t(a!.nameKey));

      const projectName = selectedProject ? t(selectedProject.nameKey) : "";

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: calculatorData.contactInfo.name,
          email: calculatorData.contactInfo.email,
          phone: calculatorData.contactInfo.phone,
          formType: "rate_calculator",
          projectType: `Web Design - ${projectName}`,
          message: `Rate Calculator Quote Request:\n\nProject Type: ${projectName}\nSelected Add-ons: ${selectedAddOns.join(", ") || "None"}\n\nEstimated Total: ${formatPrice(total, locale, tryRate)}\n\nProject Description: ${calculatorData.description || "N/A"}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send message");

      router.push(`/thank-you?type=quote&name=${calculatorData.contactInfo.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("formError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = calculatorData.projectType && calculatorData.contactInfo.name && calculatorData.contactInfo.email;

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <Calculator className="h-7 w-7 text-primary" />
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h1>
          </div>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_340px]">
            {/* Left Column — Selections */}
            <div className="space-y-10">
              {/* Project Type */}
              <section>
                <h2 className="mb-4 font-display text-xl font-semibold">
                  {t("step1Title")}
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {projectTypesMeta.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        setCalculatorData((prev) => ({ ...prev, projectType: type.id }))
                      }
                      className={`group relative rounded-xl border-2 p-5 text-left rtl:text-right transition-all hover:border-primary/50 ${
                        calculatorData.projectType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      {type.popular && (
                        <span className="absolute -top-2 right-3 rtl:right-auto rtl:left-3 rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                          {t("popular")}
                        </span>
                      )}
                      <div className="mb-2 text-primary">{type.icon}</div>
                      <h3 className="font-semibold">{t(type.nameKey)}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{t(type.descKey)}</p>
                      <div className="mt-3 border-t border-border pt-2 text-sm font-bold text-primary">
                        {formatPrice(getPrice(type.id, type.basePrice, locale), locale, tryRate)}+
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Add-ons */}
              <section>
                <h2 className="mb-4 font-display text-xl font-semibold">
                  {t("addOnsHeading")}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {addOnsMeta.map((addOn) => (
                    <button
                      key={addOn.id}
                      type="button"
                      onClick={() => toggleAddOn(addOn.id)}
                      className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left rtl:text-right transition-all hover:border-primary/50 ${
                        calculatorData.addOns.includes(addOn.id)
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="text-primary">{addOn.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{t(addOn.nameKey)}</div>
                        <div className="text-xs font-semibold text-primary">
                          +{formatPrice(getPrice(addOn.id, addOn.price, locale), locale, tryRate)}
                        </div>
                      </div>
                      {calculatorData.addOns.includes(addOn.id) && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Contact Info */}
              <section>
                <h2 className="mb-4 font-display text-xl font-semibold">
                  {t("step4Title")}
                </h2>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">
                        {t("fullName")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={calculatorData.contactInfo.name}
                        onChange={(e) =>
                          setCalculatorData((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, name: e.target.value },
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">
                        {t("emailAddress")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={calculatorData.contactInfo.email}
                        onChange={(e) =>
                          setCalculatorData((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, email: e.target.value },
                          }))
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("phoneNumber")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={calculatorData.contactInfo.phone}
                      onChange={(e) =>
                        setCalculatorData((prev) => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, phone: e.target.value },
                        }))
                      }
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">{t("projectDescription")}</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={calculatorData.description}
                      onChange={(e) =>
                        setCalculatorData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder={t("projectPlaceholder")}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column — Sticky Price Summary */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold">
                    {t("estimateSummary")}
                  </h3>

                  {calculatorData.projectType ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{selectedProject ? t(selectedProject.nameKey) : ""}</span>
                        <span>{formatPrice(basePrice, locale, tryRate)}</span>
                      </div>
                      {calculatorData.addOns.length > 0 && (
                        <>
                          <div className="my-2 border-t border-border" />
                          {calculatorData.addOns.map((addOnId) => {
                            const addOn = addOnsMeta.find((a) => a.id === addOnId);
                            return (
                              <div key={addOnId} className="flex justify-between text-muted-foreground">
                                <span>{addOn ? t(addOn.nameKey) : ""}</span>
                                <span>+{formatPrice(addOn ? getPrice(addOn.id, addOn.price, locale) : 0, locale, tryRate)}</span>
                              </div>
                            );
                          })}
                        </>
                      )}
                      <div className="mt-4 flex justify-between border-t border-border pt-3 text-base font-bold">
                        <span>{t("totalEstimate")}</span>
                        <span className="text-xl text-primary">
                          {formatPrice(total, locale, tryRate)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("step1Subtitle")}</p>
                  )}

                  {error && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="mt-6 h-12 w-full rounded-full text-base font-semibold"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? t("sending") : t("getMyQuote")}
                    <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
