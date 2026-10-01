/**
 * Zod validation schemas for forms and API requests
 */

import { z } from "zod";

// Common field validators
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

export const phoneSchema = z
  .string()
  .regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
    "Please enter a valid phone number"
  )
  .optional()
  .or(z.literal(""));

export const urlSchema = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""));

// Contact/Lead form schema
export const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: emailSchema,
  phone: phoneSchema,
  message: z
    .string()
    .max(2000, "Message must be less than 2000 characters")
    .optional(),
  projectType: z.string().optional(),
  source: z.enum(["contact_form", "chat", "whatsapp"]).optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

// Blog post schema
export const blogPostSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImage: urlSchema,
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

// Project schema
export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  category: z.string().min(1, "Category is required"),
  thumbnail: urlSchema,
  images: z.array(z.string().url()).optional(),
  liveUrl: urlSchema,
  githubUrl: urlSchema,
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Chat message schema
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message must be less than 5000 characters"),
  sessionId: z.string().min(1, "Session ID is required"),
  conversationId: z.string().uuid().optional(),
});

export type ChatMessageData = z.infer<typeof chatMessageSchema>;

// Admin settings schema
export const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(100),
  siteDescription: z.string().max(500).optional(),
  contactEmail: emailSchema,
  socialLinks: z.object({
    twitter: urlSchema,
    github: urlSchema,
    linkedin: urlSchema,
    instagram: urlSchema,
  }).optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

// Password change schema
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

// Bulk operation schemas
export const bulkLeadUpdateSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "At least one ID is required"),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
});

export type BulkLeadUpdateData = z.infer<typeof bulkLeadUpdateSchema>;

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "At least one ID is required"),
});

export type BulkDeleteData = z.infer<typeof bulkDeleteSchema>;

// Search schema
export const searchSchema = z.object({
  query: z.string().min(2, "Search query must be at least 2 characters").max(100),
  type: z.enum(["all", "leads", "conversations", "projects", "blog"]).optional(),
});

export type SearchData = z.infer<typeof searchSchema>;

// Helper function to extract validation errors
export function getValidationErrors(
  error: z.ZodError
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}
