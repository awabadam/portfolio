"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calculator,
  DollarSign,
  Clock,
  Zap,
  CheckCircle,
  Globe,
  Palette,
  Code,
  FileText,
  Settings,
  Smartphone,
  Mail,
  Image,
  Search,
  Shield,
  Database,
} from "lucide-react";
import Link from "next/link";

interface PricingConfig {
  basePrices: {
    landing: number;
    business: number;
    custom: number;
  };
  pagePricing: {
    included: number;
    additional: number;
  };
  features: {
    [key: string]: {
      name: string;
      price: number;
      description: string;
      icon: React.ReactNode;
    };
  };
  timelines: {
    [key: string]: {
      name: string;
      multiplier: number;
      description: string;
    };
  };
  maintenance: {
    [key: string]: {
      name: string;
      price: number;
      description: string;
    };
  };
}

const pricingConfig: PricingConfig = {
  basePrices: {
    landing: 150,
    business: 300,
    custom: 800,
  },
  pagePricing: {
    included: 3,
    additional: 50,
  },
  features: {
    contactForms: {
      name: "Contact Forms",
      price: 20,
      description: "Professional contact forms with email notifications",
      icon: <Mail className="h-4 w-4" />,
    },
    newsletter: {
      name: "Newsletter Signup",
      price: 15,
      description: "Email newsletter integration",
      icon: <Mail className="h-4 w-4" />,
    },
    gallery: {
      name: "Image Gallery",
      price: 30,
      description: "Professional image gallery with lightbox",
      icon: <Image className="h-4 w-4" />,
    },
    blog: {
      name: "Blog Section",
      price: 60,
      description: "Full blog with categories and search",
      icon: <FileText className="h-4 w-4" />,
    },
    socialMedia: {
      name: "Social Media Integration",
      price: 25,
      description: "Social media sharing and feeds",
      icon: <Globe className="h-4 w-4" />,
    },
    multilingual: {
      name: "Multi-language Support",
      price: 80,
      description: "Support for multiple languages",
      icon: <Globe className="h-4 w-4" />,
    },
    animations: {
      name: "Custom Animations",
      price: 40,
      description: "Smooth scroll animations and effects",
      icon: <Palette className="h-4 w-4" />,
    },
    advancedNav: {
      name: "Advanced Navigation",
      price: 35,
      description: "Mega menu and advanced navigation",
      icon: <Code className="h-4 w-4" />,
    },
    search: {
      name: "Search Functionality",
      price: 45,
      description: "Site-wide search with filters",
      icon: <Search className="h-4 w-4" />,
    },
    userRegistration: {
      name: "User Registration",
      price: 100,
      description: "User accounts and login system",
      icon: <Settings className="h-4 w-4" />,
    },
    seo: {
      name: "SEO Optimization",
      price: 60,
      description: "Complete SEO setup and optimization",
      icon: <Search className="h-4 w-4" />,
    },
    analytics: {
      name: "Google Analytics Setup",
      price: 20,
      description: "Analytics and tracking setup",
      icon: <Settings className="h-4 w-4" />,
    },
    performance: {
      name: "Performance Optimization",
      price: 50,
      description: "Speed optimization and caching",
      icon: <Zap className="h-4 w-4" />,
    },
    security: {
      name: "Security Features",
      price: 40,
      description: "SSL, security headers, and protection",
      icon: <Shield className="h-4 w-4" />,
    },
    database: {
      name: "Database Integration",
      price: 120,
      description: "Custom database and data management",
      icon: <Database className="h-4 w-4" />,
    },
    copywriting: {
      name: "Professional Copywriting",
      price: 40,
      description: "Professional content writing per page",
      icon: <FileText className="h-4 w-4" />,
    },
    logoDesign: {
      name: "Logo Design",
      price: 80,
      description: "Custom logo with variations",
      icon: <Palette className="h-4 w-4" />,
    },
    branding: {
      name: "Brand Identity Package",
      price: 120,
      description: "Complete brand identity design",
      icon: <Palette className="h-4 w-4" />,
    },
    stockPhotos: {
      name: "Stock Photos Included",
      price: 30,
      description: "Professional stock photos for your site",
      icon: <Image className="h-4 w-4" />,
    },
    cms: {
      name: "Content Management System",
      price: 80,
      description: "Easy-to-use CMS for content updates",
      icon: <Settings className="h-4 w-4" />,
    },
    training: {
      name: "Training Session",
      price: 50,
      description: "1-hour training on how to manage your site",
      icon: <Settings className="h-4 w-4" />,
    },
  },
  timelines: {
    standard: {
      name: "Standard (2-3 weeks)",
      multiplier: 1,
      description: "Normal delivery time",
    },
    rush: {
      name: "Rush (1-2 weeks)",
      multiplier: 1.3,
      description: "Faster delivery with rush fee",
    },
    express: {
      name: "Express (1 week)",
      multiplier: 1.5,
      description: "Fastest delivery with express fee",
    },
  },
  maintenance: {
    none: {
      name: "No maintenance needed",
      price: 0,
      description: "You'll manage updates yourself",
    },
    monthly: {
      name: "Monthly Maintenance",
      price: 30,
      description: "Regular updates and support",
    },
    quarterly: {
      name: "Quarterly Updates",
      price: 15,
      description: "Updates every 3 months",
    },
  },
};

export default function RateCalculator() {
  const [projectType, setProjectType] = useState<string>("business");
  const [pageCount, setPageCount] = useState<number>(5);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string>("standard");
  const [maintenance, setMaintenance] = useState<string>("none");

  // Form submission states
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate base price
  const getBasePrice = () => {
    return (
      pricingConfig.basePrices[
        projectType as keyof typeof pricingConfig.basePrices
      ] || 0
    );
  };

  // Calculate page cost
  const getPageCost = () => {
    const included = pricingConfig.pagePricing.included;
    const additional = Math.max(0, pageCount - included);
    return additional * pricingConfig.pagePricing.additional;
  };

  // Calculate features cost
  const getFeaturesCost = () => {
    return selectedFeatures.reduce((total, feature) => {
      return total + (pricingConfig.features[feature]?.price || 0);
    }, 0);
  };

  // Calculate total
  const getTotal = () => {
    const basePrice = getBasePrice();
    const pageCost = getPageCount();
    const featuresCost = getFeaturesCost();
    const subtotal = basePrice + pageCost + featuresCost;
    const timelineMultiplier =
      pricingConfig.timelines[timeline]?.multiplier || 1;
    return subtotal * timelineMultiplier;
  };

  const getPageCount = () => {
    const included = pricingConfig.pagePricing.included;
    const additional = Math.max(0, pageCount - included);
    return additional * pricingConfig.pagePricing.additional;
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  const getSelectedFeatures = () => {
    return selectedFeatures
      .map((feature) => pricingConfig.features[feature])
      .filter(Boolean);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const calculatorData = {
        projectType,
        pageCount,
        selectedFeatures: getSelectedFeatures().map((f) => f.name),
        timeline: pricingConfig.timelines[timeline]?.name,
        maintenance: pricingConfig.maintenance[maintenance]?.name,
        totalPrice: getTotal(),
        basePrice: getBasePrice(),
        pageCost: getPageCount(),
        featuresCost: getFeaturesCost(),
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formType: "rate_calculator",
          projectType: "website_quote",
          message: `Rate Calculator Quote Request:
          
Project Details:
- Type: ${calculatorData.projectType === "landing" ? "Landing Page" : calculatorData.projectType === "business" ? "Business Website" : "Custom Website"}
- Pages: ${calculatorData.pageCount}
- Timeline: ${calculatorData.timeline}
- Maintenance: ${calculatorData.maintenance}

Selected Features: ${calculatorData.selectedFeatures.join(", ")}

Pricing Breakdown:
- Base Price: $${calculatorData.basePrice}
- Additional Pages: $${calculatorData.pageCost}
- Features: $${calculatorData.featuresCost}
- Total: $${calculatorData.totalPrice}

Project Description: ${formData.projectDescription}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSubmitted(true);
      setShowForm(false);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          projectDescription: "",
        });
      }, 5000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const featureCategories = {
    essential: ["contactForms", "newsletter", "gallery", "blog", "socialMedia"],
    advanced: [
      "multilingual",
      "animations",
      "advancedNav",
      "search",
      "userRegistration",
    ],
    technical: ["seo", "analytics", "performance", "security", "database"],
    content: [
      "copywriting",
      "logoDesign",
      "branding",
      "stockPhotos",
      "cms",
      "training",
    ],
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[40vh] flex-col items-center justify-center px-4 py-16">
        <div className="space-y-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Website Cost Calculator
            </h1>
          </div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Get an instant, personalized quote for your website project.
            Professional web design at Turkish market prices.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Calculator Form */}
            <div className="space-y-8 lg:col-span-2">
              {/* Project Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    What type of website do you need?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      {
                        id: "landing",
                        name: "Landing Page",
                        desc: "Single page, conversion-focused",
                      },
                      {
                        id: "business",
                        name: "Business Website",
                        desc: "Multi-page professional site",
                      },
                      {
                        id: "custom",
                        name: "Custom Website",
                        desc: "Advanced features & functionality",
                      },
                    ].map((type) => (
                      <div
                        key={type.id}
                        className={`cursor-pointer rounded-lg border p-4 transition-all ${
                          projectType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setProjectType(type.id)}
                      >
                        <div className="font-semibold">{type.name}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {type.desc}
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          $
                          {
                            pricingConfig.basePrices[
                              type.id as keyof typeof pricingConfig.basePrices
                            ]
                          }
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Number of Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>How many pages do you need?</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {pricingConfig.pagePricing.included} pages included in base
                    price
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Pages: {pageCount}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        +${getPageCount()} for additional pages
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                      <span>20</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Features</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select the features you need for your website
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(featureCategories).map(
                      ([category, features]) => (
                        <div key={category}>
                          <h4 className="mb-3 font-semibold capitalize">
                            {category === "essential" && "Essential Features"}
                            {category === "advanced" && "Advanced Features"}
                            {category === "technical" && "Technical Features"}
                            {category === "content" && "Content & Branding"}
                          </h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            {features.map((featureId) => {
                              const feature = pricingConfig.features[featureId];
                              if (!feature) return null;

                              return (
                                <div
                                  key={featureId}
                                  className="flex items-start space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                >
                                  <Checkbox
                                    id={featureId}
                                    checked={selectedFeatures.includes(
                                      featureId,
                                    )}
                                    onCheckedChange={() =>
                                      handleFeatureToggle(featureId)
                                    }
                                  />
                                  <div className="flex-1">
                                    <Label
                                      htmlFor={featureId}
                                      className="flex cursor-pointer items-center gap-2 font-medium"
                                    >
                                      {feature.icon}
                                      {feature.name}
                                    </Label>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {feature.description}
                                    </p>
                                    <Badge variant="secondary" className="mt-2">
                                      +${feature.price}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline & Maintenance */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Delivery Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(pricingConfig.timelines).map(
                        ([key, timelineOption]) => (
                          <div
                            key={key}
                            className={`cursor-pointer rounded-lg border p-3 transition-all ${
                              timeline === key
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setTimeline(key)}
                          >
                            <div className="font-medium">
                              {timelineOption.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {timelineOption.description}
                            </div>
                            {timelineOption.multiplier > 1 && (
                              <Badge variant="outline" className="mt-1">
                                +
                                {Math.round(
                                  (timelineOption.multiplier - 1) * 100,
                                )}
                                % fee
                              </Badge>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Ongoing Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(pricingConfig.maintenance).map(
                        ([key, maintenanceOption]) => (
                          <div
                            key={key}
                            className={`cursor-pointer rounded-lg border p-3 transition-all ${
                              maintenance === key
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setMaintenance(key)}
                          >
                            <div className="font-medium">
                              {maintenanceOption.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {maintenanceOption.description}
                            </div>
                            {maintenanceOption.price > 0 && (
                              <Badge variant="outline" className="mt-1">
                                ${maintenanceOption.price}/month
                              </Badge>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Project Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Base Price */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {projectType === "landing" && "Landing Page"}
                      {projectType === "business" && "Business Website"}
                      {projectType === "custom" && "Custom Website"}
                    </span>
                    <span className="font-semibold">
                      ${getBasePrice().toLocaleString()}
                    </span>
                  </div>

                  {/* Page Cost */}
                  {getPageCount() > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Additional pages (
                        {pageCount - pricingConfig.pagePricing.included})
                      </span>
                      <span className="text-sm font-semibold">
                        +${getPageCount().toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Features */}
                  {getSelectedFeatures().length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Selected Features:
                        </div>
                        {getSelectedFeatures().map((feature) => (
                          <div
                            key={feature.name}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="truncate">{feature.name}</span>
                            <span>+${feature.price}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Timeline Fee */}
                  {pricingConfig.timelines[timeline]?.multiplier > 1 && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {pricingConfig.timelines[timeline]?.name} Fee
                        </span>
                        <span className="text-sm font-semibold">
                          +$
                          {(getBasePrice() +
                            getPageCount() +
                            getFeaturesCost()) *
                            (pricingConfig.timelines[timeline]?.multiplier - 1)}
                        </span>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Total */}
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Estimate</span>
                    <span className="text-2xl text-primary">
                      ${getTotal().toLocaleString()}
                    </span>
                  </div>

                  {/* Maintenance */}
                  {pricingConfig.maintenance[maintenance]?.price > 0 && (
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="text-sm font-medium">
                        Monthly Maintenance
                      </div>
                      <div className="text-lg font-semibold text-primary">
                        +${pricingConfig.maintenance[maintenance]?.price}/month
                      </div>
                    </div>
                  )}

                  {/* Delivery Time */}
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="text-sm font-medium">
                      Estimated Delivery
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {pricingConfig.timelines[timeline]?.name}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setShowForm(true)}
                    >
                      Get Started - Free Consultation
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/projects">View Portfolio</Link>
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• All prices in USD</p>
                    <p>• 50% deposit required to start</p>
                    <p>• Free revisions included</p>
                    <p>• 30-day support after launch</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                How accurate is this calculator?
              </h3>
              <p className="text-muted-foreground">
                This calculator provides a good estimate based on typical
                project requirements. Final pricing may vary based on specific
                needs and complexity.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                What's included in the price?
              </h3>
              <p className="text-muted-foreground">
                All prices include design, development, testing, and basic SEO
                setup. Hosting and domain registration are additional.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Do you offer payment plans?
              </h3>
              <p className="text-muted-foreground">
                Yes! We require a 50% deposit to start, with the remaining
                balance due upon project completion.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Can I make changes after launch?
              </h3>
              <p className="text-muted-foreground">
                We include free revisions during development and 30 days of
                support after launch. Additional changes can be quoted
                separately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Get Your Free Consultation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Fill out the form below and I'll get back to you with a detailed
                quote.
              </p>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="py-8 text-center">
                  <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                  <h3 className="mb-2 text-lg font-semibold">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your consultation request has been sent. I'll get back to
                    you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectDescription">
                      Project Description
                    </Label>
                    <Textarea
                      id="projectDescription"
                      rows={3}
                      value={formData.projectDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          projectDescription: e.target.value,
                        }))
                      }
                      placeholder="Tell me more about your project..."
                    />
                  </div>

                  {error && (
                    <div className="text-center text-sm text-red-500">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Sending..." : "Send Request"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
