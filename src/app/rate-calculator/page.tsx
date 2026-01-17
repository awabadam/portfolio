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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface CalculatorData {
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

const projectTypes = [
  {
    id: "landing",
    name: "Landing Page",
    description: "Single page for product/service promotion",
    basePrice: 200,
    icon: <Globe className="h-6 w-6" />,
  },
  {
    id: "business",
    name: "Business Website",
    description: "Complete website for your business (3-5 pages)",
    basePrice: 450,
    icon: <Code className="h-6 w-6" />,
    popular: true,
  },
  {
    id: "custom",
    name: "Custom Website",
    description: "Complex website with custom features",
    basePrice: 900,
    icon: <Zap className="h-6 w-6" />,
  },
];

const complexities = [
  { id: "simple", name: "Simple", multiplier: 1 },
  { id: "medium", name: "Medium", multiplier: 1.2 },
  { id: "complex", name: "Complex", multiplier: 1.5 },
];

const popularAddOns = [
  { id: "seo", name: "SEO Setup", price: 70, icon: <Zap className="h-4 w-4" /> },
  { id: "blog", name: "Blog System", price: 90, icon: <Mail className="h-4 w-4" /> },
  { id: "mobile", name: "Mobile Optimization", price: 50, icon: <Smartphone className="h-4 w-4" /> },
];

export default function RateCalculator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    projectType: "business",
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

  const selectedProject = projectTypes.find(
    (p) => p.id === calculatorData.projectType,
  );
  const selectedComplexity = complexities.find(
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
        .map((id) => popularAddOns.find((a) => a.id === id)?.name)
        .filter(Boolean);

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
          projectType: "website_quote",
          message: `Rate Calculator Quote Request:

Project Type: ${selectedProject?.name}
Complexity: ${selectedComplexity?.name}
Selected Add-ons: ${selectedAddOns.join(", ") || "None"}

Estimated Total: $${total.toLocaleString()}

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
        setError("Something went wrong. Please try again later.");
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
              Website Cost Calculator
            </h1>
          </motion.div>
          <motion.p
            className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground"
            variants={fadeInUp}
          >
            Get an instant estimate in just 3 simple steps. No complicated forms,
            just the essentials.
          </motion.p>
        </motion.div>
      </section>

      {/* Calculator Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Progress Steps */}
            <div className="mb-12 flex items-center justify-center gap-4">
              {[1, 2, 3].map((stepNumber) => (
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
                  {stepNumber < 3 && (
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
                        What type of website do you need?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        {projectTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() =>
                              setCalculatorData((prev) => ({
                                ...prev,
                                projectType: type.id,
                              }))
                            }
                            className={`group relative rounded-lg border-2 p-6 text-left transition-all hover:border-primary/50 ${
                              calculatorData.projectType === type.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            {type.popular && (
                              <span className="absolute -top-2 right-4 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                Popular
                              </span>
                            )}
                            <div className="mb-3 text-primary">{type.icon}</div>
                            <h3 className="mb-1 font-display text-xl font-semibold">
                              {type.name}
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                              {type.description}
                            </p>
                            <div className="text-2xl font-bold text-primary">
                              ${type.basePrice}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-8 flex justify-end">
                        <Button
                          onClick={() => setStep(2)}
                          size="lg"
                          className="h-14 px-8 text-lg"
                          disabled={!calculatorData.projectType}
                        >
                          Next: Choose Complexity
                          <ArrowRight className="ml-2 h-5 w-5" />
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
                        How complex is your project?
                      </CardTitle>
                      <p className="text-muted-foreground">
                        This helps us estimate the development time and effort
                        required.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        {complexities.map((complexity) => (
                          <button
                            key={complexity.id}
                            onClick={() =>
                              setCalculatorData((prev) => ({
                                ...prev,
                                complexity: complexity.id,
                              }))
                            }
                            className={`rounded-lg border-2 p-6 text-left transition-all hover:border-primary/50 ${
                              calculatorData.complexity === complexity.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <h3 className="mb-2 font-display text-xl font-semibold">
                              {complexity.name}
                            </h3>
                            {complexity.multiplier > 1 && (
                              <p className="text-sm text-muted-foreground">
                                +{Math.round((complexity.multiplier - 1) * 100)}%
                                adjustment
                              </p>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="rounded-lg border border-border/40 bg-muted/30 p-6">
                        <h4 className="mb-4 font-semibold">
                          Popular Add-ons (Optional)
                        </h4>
                        <div className="grid gap-3 md:grid-cols-3">
                          {popularAddOns.map((addOn) => (
                            <button
                              key={addOn.id}
                              onClick={() => toggleAddOn(addOn.id)}
                              className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:border-primary/50 ${
                                calculatorData.addOns.includes(addOn.id)
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              }`}
                            >
                              <div className="text-primary">{addOn.icon}</div>
                              <div className="flex-1">
                                <div className="font-medium">{addOn.name}</div>
                                <div className="text-sm font-semibold text-primary">
                                  +${addOn.price}
                                </div>
                              </div>
                              {calculatorData.addOns.includes(addOn.id) && (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          onClick={() => setStep(1)}
                          variant="outline"
                          size="lg"
                          className="h-14 px-8 text-lg"
                        >
                          <ArrowLeft className="mr-2 h-5 w-5" />
                          Back
                        </Button>
                        <Button
                          onClick={() => setStep(3)}
                          size="lg"
                          className="h-14 px-8 text-lg"
                        >
                          Next: Your Details
                          <ArrowRight className="ml-2 h-5 w-5" />
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-display text-3xl">
                          Your Details & Project Summary
                        </CardTitle>
                        <p className="text-muted-foreground">
                          Fill in your information to receive the detailed quote
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Price Summary */}
                        <div className="rounded-lg border border-border/40 bg-muted/30 p-6">
                          <h4 className="mb-4 font-semibold">Estimate Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>{selectedProject?.name}</span>
                              <span>${basePrice.toLocaleString()}</span>
                            </div>
                            {complexityMultiplier > 1 && (
                              <div className="flex justify-between">
                                <span>{selectedComplexity?.name} Complexity</span>
                                <span>
                                  +$
                                  {(
                                    basePrice * (complexityMultiplier - 1)
                                  ).toLocaleString()}
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
                                      <span>{addOn?.name}</span>
                                      <span>+${addOn?.price}</span>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                            <div className="mt-4 flex justify-between border-t border-border pt-2 text-lg font-bold">
                              <span>Total Estimate</span>
                              <span className="text-2xl text-primary">
                                ${total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Form */}
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <Label htmlFor="name">
                              Full Name <span className="text-red-500">*</span>
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
                              Email Address{" "}
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
                          <Label htmlFor="phone">Phone Number (Optional)</Label>
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
                            Project Description (Optional)
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
                            placeholder="Tell us more about your project..."
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
                            onClick={() => setStep(2)}
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg"
                          >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            size="lg"
                            className="h-14 px-8 text-lg"
                            disabled={isSubmitting}
                          >
                            {isSubmitting
                              ? "Sending..."
                              : "Get My Quote"}
                            <ArrowRight className="ml-2 h-5 w-5" />
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
