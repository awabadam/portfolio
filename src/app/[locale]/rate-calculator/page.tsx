"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calculator,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Globe,
  Smartphone,
  Code,
  Zap,
  Mail,
  Layout,
  Palette,
  Bot,
} from "lucide-react";
import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useTranslations, useLocale } from 'next-intl';

interface CalculatorData {
  serviceType: string;
  projectType: string;
  complexity: string;
  addOns: string[];
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  description?: string;
}

const servicesMeta = [
  {
    id: "web-design",
    nameKey: "webDesignName" as const,
    descKey: "webDesignDesc" as const,
    icon: <Layout className="h-8 w-8" />,
    slug: "webdesign-istanbul",
  },
  {
    id: "graphic-design",
    nameKey: "graphicDesignName" as const,
    descKey: "graphicDesignDesc" as const,
    icon: <Palette className="h-8 w-8" />,
    slug: "graphic-design-istanbul",
  },
  {
    id: "ai-chatbot",
    nameKey: "aiChatbotName" as const,
    descKey: "aiChatbotDesc" as const,
    icon: <Bot className="h-8 w-8" />,
    slug: "ai-chatbot-integration",
  },
];

const getProjectTypesMeta = (serviceType: string) => {
  if (serviceType === "web-design") {
    return [
      { id: "landing", nameKey: "landingPage" as const, descKey: "landingPageDesc" as const, basePrice: 800, icon: <Globe className="h-6 w-6" /> },
      { id: "business", nameKey: "businessWebsite" as const, descKey: "businessWebsiteDesc" as const, basePrice: 1200, icon: <Code className="h-6 w-6" />, popular: true },
      { id: "custom", nameKey: "customWebsite" as const, descKey: "customWebsiteDesc" as const, basePrice: 3000, icon: <Code className="h-6 w-6" /> },
    ];
  } else if (serviceType === "graphic-design") {
    return [
      { id: "logo", nameKey: "logoDesign" as const, descKey: "logoDesignDesc" as const, basePrice: 100, icon: <Palette className="h-6 w-6" /> },
      { id: "ui-ux", nameKey: "uiuxDesign" as const, descKey: "uiuxDesignDesc" as const, basePrice: 400, icon: <Layout className="h-6 w-6" />, popular: true },
      { id: "brand-identity", nameKey: "brandIdentity" as const, descKey: "brandIdentityDesc" as const, basePrice: 800, icon: <Palette className="h-6 w-6" /> },
      { id: "custom-design", nameKey: "customDesign" as const, descKey: "customDesignDesc" as const, basePrice: 2000, icon: <Zap className="h-6 w-6" /> },
    ];
  } else if (serviceType === "ai-chatbot") {
    return [
      { id: "basic", nameKey: "basicChatbot" as const, descKey: "basicChatbotDesc" as const, basePrice: 600, icon: <Bot className="h-6 w-6" /> },
      { id: "advanced", nameKey: "advancedChatbot" as const, descKey: "advancedChatbotDesc" as const, basePrice: 1500, icon: <Bot className="h-6 w-6" />, popular: true },
      { id: "enterprise", nameKey: "enterpriseSolution" as const, descKey: "enterpriseSolutionDesc" as const, basePrice: 4000, icon: <Zap className="h-6 w-6" /> },
    ];
  }
  return [];
};

const getAddOnsMeta = (serviceType: string) => {
  if (serviceType === "web-design") {
    return [
      { id: "seo", nameKey: "seoSetup" as const, price: 200, icon: <Zap className="h-4 w-4" /> },
      { id: "blog", nameKey: "blogSystem" as const, price: 300, icon: <Mail className="h-4 w-4" /> },
      { id: "mobile", nameKey: "mobileApp" as const, price: 1500, icon: <Smartphone className="h-4 w-4" /> },
      { id: "cms", nameKey: "contentManagement" as const, price: 400, icon: <Code className="h-4 w-4" /> },
    ];
  } else if (serviceType === "graphic-design") {
    return [
      { id: "social", nameKey: "socialMediaGraphics" as const, price: 150, icon: <Globe className="h-4 w-4" /> },
      { id: "print", nameKey: "printMaterials" as const, price: 200, icon: <Mail className="h-4 w-4" /> },
      { id: "animation", nameKey: "animationMotion" as const, price: 500, icon: <Zap className="h-4 w-4" /> },
      { id: "illustration", nameKey: "customIllustrations" as const, price: 300, icon: <Palette className="h-4 w-4" /> },
    ];
  } else if (serviceType === "ai-chatbot") {
    return [
      { id: "multilang", nameKey: "multiLanguage" as const, price: 200, icon: <Globe className="h-4 w-4" /> },
      { id: "analytics", nameKey: "advancedAnalytics" as const, price: 150, icon: <Zap className="h-4 w-4" /> },
      { id: "integration", nameKey: "crmIntegration" as const, price: 300, icon: <Code className="h-4 w-4" /> },
      { id: "training", nameKey: "customTrainingData" as const, price: 400, icon: <Bot className="h-4 w-4" /> },
    ];
  }
  return [];
};

const complexitiesMeta = [
  { id: "simple", nameKey: "simple" as const, multiplier: 1 },
  { id: "medium", nameKey: "medium" as const, multiplier: 1.2 },
  { id: "complex", nameKey: "complex" as const, multiplier: 1.5 },
];

const TRY_RATE = 38;

function formatPrice(amount: number, locale: string): string {
  if (locale === 'tr') {
    const tryAmount = Math.round(amount * TRY_RATE / 100) * 100;
    return `₺${tryAmount.toLocaleString('tr-TR')}`;
  }
  return `$${amount.toLocaleString()}`;
}

export default function RateCalculator() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('rateCalculator');
  const [step, setStep] = useState(1);
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    serviceType: "",
    projectType: "",
    complexity: "medium",
    addOns: [],
    contactInfo: {
      name: "",
      email: "",
      phone: "",
    },
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectTypes = getProjectTypesMeta(calculatorData.serviceType);
  const popularAddOns = getAddOnsMeta(calculatorData.serviceType);

  const selectedService = servicesMeta.find(
    (s) => s.id === calculatorData.serviceType,
  );
  const selectedProject = projectTypes.find(
    (p) => p.id === calculatorData.projectType,
  );
  const selectedComplexity = complexitiesMeta.find(
    (c) => c.id === calculatorData.complexity,
  );

  const basePrice = selectedProject?.basePrice || 0;
  const complexityMultiplier = selectedComplexity?.multiplier || 1;
  const addOnsCost = calculatorData.addOns.reduce((total, addOnId) => {
    const addOn = popularAddOns.find((a) => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);

  const subtotal = basePrice * complexityMultiplier;
  const total = subtotal + addOnsCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const selectedAddOns = calculatorData.addOns
        .map((id) => {
          const addOn = popularAddOns.find((a) => a.id === id);
          return addOn ? t(addOn.nameKey) : undefined;
        })
        .filter(Boolean);

      const serviceName = selectedService ? t(selectedService.nameKey) : '';
      const projectName = selectedProject ? t(selectedProject.nameKey) : '';
      const complexityName = selectedComplexity ? t(selectedComplexity.nameKey) : '';

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: calculatorData.contactInfo.name,
          email: calculatorData.contactInfo.email,
          phone: calculatorData.contactInfo.phone,
          formType: "rate_calculator",
          projectType: `${serviceName} - ${projectName}`,
          message: `Rate Calculator Quote Request:

Service: ${serviceName}
Project Type: ${projectName}
Complexity: ${complexityName}
Selected Add-ons: ${selectedAddOns.join(", ") || "None"}

Estimated Total: ${formatPrice(total, locale)}

Project Description: ${calculatorData.description || "N/A"}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      router.push(`/thank-you?type=quote&name=${calculatorData.contactInfo.name}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('formError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAddOn = (addOnId: string) => {
    setCalculatorData((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter((id) => id !== addOnId)
        : [...prev.addOns, addOnId],
    }));
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[40vh] flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6 text-center"
        >
          <motion.div
            className="mb-4 flex items-center justify-center gap-2"
            variants={fadeInUp}
          >
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="font-display text-display-3 tracking-tight">
              {t('title')}
            </h1>
          </motion.div>
          <motion.p
            className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground"
            variants={fadeInUp}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Calculator Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Progress Steps */}
            <div className="mb-12 flex items-center justify-center gap-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium transition-all ${
                      step >= stepNumber
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {step > stepNumber ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                    {stepNumber < 4 && (
                    <div
                      className={`h-1 w-16 transition-all ${
                        step > stepNumber ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display text-3xl">
                        {t('step1Title')}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {t('step1Subtitle')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        {servicesMeta.map((service) => (
                          <button
                            key={service.id}
                            onClick={() =>
                              setCalculatorData((prev) => ({
                                ...prev,
                                serviceType: service.id,
                                projectType: "", // Reset project type when service changes
                                addOns: [], // Reset add-ons when service changes
                              }))
                            }
                            className={`group relative rounded-lg border-2 p-6 text-left rtl:text-right transition-all hover:border-primary/50 ${
                              calculatorData.serviceType === service.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <div className="mb-3 text-primary">{service.icon}</div>
                            <h3 className="mb-1 font-display text-xl font-semibold">
                              {t(service.nameKey)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {t(service.descKey)}
                            </p>
                          </button>
                        ))}
                      </div>

                      <div className="mt-8 flex justify-end">
                        <Button
                          onClick={() => setStep(2)}
                          size="lg"
                          className="h-14 px-8 text-lg"
                          disabled={!calculatorData.serviceType}
                        >
                          {t('step1Button')}
                          <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display text-3xl">
                        {t('step2Title', { service: selectedService ? t(selectedService.nameKey).toLowerCase() : '' })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {projectTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() =>
                              setCalculatorData((prev) => ({
                                ...prev,
                                projectType: type.id,
                              }))
                            }
                            className={`group relative rounded-lg border-2 p-6 text-left rtl:text-right transition-all hover:border-primary/50 ${
                              calculatorData.projectType === type.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            {type.popular && (
                              <span className="absolute -top-2 right-4 rtl:right-auto rtl:left-4 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                {t('popular')}
                              </span>
                            )}
                            <div className="mb-3 text-primary">{type.icon}</div>
                            <h3 className="mb-1 font-display text-xl font-semibold">
                              {t(type.nameKey)}
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                              {t(type.descKey)}
                            </p>
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(type.basePrice, locale)}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-8 flex justify-between">
                        <Button
                          onClick={() => setStep(1)}
                          variant="outline"
                          size="lg"
                          className="h-14 px-8 text-lg"
                        >
                          <ArrowLeft className="mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180 h-5 w-5" />
                          {t('back')}
                        </Button>
                        <Button
                          onClick={() => setStep(3)}
                          size="lg"
                          className="h-14 px-8 text-lg"
                          disabled={!calculatorData.projectType}
                        >
                          {t('step2Button')}
                          <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display text-3xl">
                        {t('step3Title')}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {t('step3Subtitle')}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        {complexitiesMeta.map((complexity) => (
                          <button
                            key={complexity.id}
                            onClick={() =>
                              setCalculatorData((prev) => ({
                                ...prev,
                                complexity: complexity.id,
                              }))
                            }
                            className={`rounded-lg border-2 p-6 text-left rtl:text-right transition-all hover:border-primary/50 ${
                              calculatorData.complexity === complexity.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <h3 className="mb-2 font-display text-xl font-semibold">
                              {t(complexity.nameKey)}
                            </h3>
                            {complexity.multiplier > 1 && (
                              <p className="text-sm text-muted-foreground">
                                +{Math.round((complexity.multiplier - 1) * 100)}%
                                {' '}{t('adjustment')}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>

                      {popularAddOns.length > 0 && (
                        <div className="rounded-lg border border-border/40 bg-muted/30 p-6">
                          <h4 className="mb-4 font-semibold">
                            {t('addOnsHeading')}
                          </h4>
                          <div className="grid gap-3 md:grid-cols-3">
                            {popularAddOns.map((addOn) => (
                            <button
                              key={addOn.id}
                              onClick={() => toggleAddOn(addOn.id)}
                              className={`flex items-center gap-3 rounded-lg border p-4 text-left rtl:text-right transition-all hover:border-primary/50 ${
                                calculatorData.addOns.includes(addOn.id)
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              }`}
                            >
                              <div className="text-primary">{addOn.icon}</div>
                              <div className="flex-1">
                                <div className="font-medium">{t(addOn.nameKey)}</div>
                                <div className="text-sm font-semibold text-primary">
                                  +{formatPrice(addOn.price, locale)}
                                </div>
                              </div>
                              {calculatorData.addOns.includes(addOn.id) && (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              )}
                            </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button
                          onClick={() => setStep(2)}
                          variant="outline"
                          size="lg"
                          className="h-14 px-8 text-lg"
                        >
                          <ArrowLeft className="mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180 h-5 w-5" />
                          {t('back')}
                        </Button>
                        <Button
                          onClick={() => setStep(4)}
                          size="lg"
                          className="h-14 px-8 text-lg"
                        >
                          {t('step3Button')}
                          <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-display text-3xl">
                          {t('step4Title')}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {t('step4Subtitle')}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Price Summary */}
                        <div className="rounded-lg border border-border/40 bg-muted/30 p-6">
                          <h4 className="mb-4 font-semibold">{t('estimateSummary')}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">{selectedService ? t(selectedService.nameKey) : ''}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{selectedProject ? t(selectedProject.nameKey) : ''}</span>
                              <span>{formatPrice(basePrice, locale)}</span>
                            </div>
                            {complexityMultiplier > 1 && (
                              <div className="flex justify-between">
                                <span>{selectedComplexity ? t(selectedComplexity.nameKey) : ''} {t('adjustment')}</span>
                                <span>
                                  +{formatPrice(basePrice * (complexityMultiplier - 1), locale)}
                                </span>
                              </div>
                            )}
                            {calculatorData.addOns.length > 0 && (
                              <>
                                <div className="my-2 border-t border-border" />
                                {calculatorData.addOns.map((addOnId) => {
                                  const addOn = popularAddOns.find(
                                    (a) => a.id === addOnId,
                                  );
                                  return (
                                    <div
                                      key={addOnId}
                                      className="flex justify-between"
                                    >
                                      <span>{addOn ? t(addOn.nameKey) : ''}</span>
                                      <span>+{formatPrice(addOn?.price || 0, locale)}</span>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                            <div className="mt-4 flex justify-between border-t border-border pt-2 text-lg font-bold">
                              <span>{t('totalEstimate')}</span>
                              <span className="text-2xl text-primary">
                                {formatPrice(total, locale)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Form */}
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <Label htmlFor="name">
                              {t('fullName')} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              required
                              value={calculatorData.contactInfo.name}
                              onChange={(e) =>
                                setCalculatorData((prev) => ({
                                  ...prev,
                                  contactInfo: {
                                    ...prev.contactInfo,
                                    name: e.target.value,
                                  },
                                }))
                              }
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label htmlFor="email">
                              {t('emailAddress')}{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={calculatorData.contactInfo.email}
                              onChange={(e) =>
                                setCalculatorData((prev) => ({
                                  ...prev,
                                  contactInfo: {
                                    ...prev.contactInfo,
                                    email: e.target.value,
                                  },
                                }))
                              }
                              className="mt-2"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="phone">{t('phoneNumber')}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={calculatorData.contactInfo.phone}
                            onChange={(e) =>
                              setCalculatorData((prev) => ({
                                ...prev,
                                contactInfo: {
                                  ...prev.contactInfo,
                                  phone: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">
                            {t('projectDescription')}
                          </Label>
                          <Textarea
                            id="description"
                            rows={3}
                            value={calculatorData.description}
                            onChange={(e) =>
                              setCalculatorData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder={t('projectPlaceholder')}
                            className="mt-2"
                          />
                        </div>

                        {error && (
                          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                            {error}
                          </div>
                        )}

                        <div className="flex justify-between">
                          <Button
                            type="button"
                            onClick={() => setStep(3)}
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg"
                          >
                            <ArrowLeft className="mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180 h-5 w-5" />
                            {t('back')}
                          </Button>
                          <Button
                            type="submit"
                            size="lg"
                            className="h-14 px-8 text-lg"
                            disabled={isSubmitting}
                          >
                            {isSubmitting
                              ? t('sending')
                              : t('getMyQuote')}
                            <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
