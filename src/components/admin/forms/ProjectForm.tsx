"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabase";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSuccess?: () => void;
}

export default function ProjectForm({
  initialData,
  onSuccess,
}: ProjectFormProps) {
  const router = useRouter();
  const { user } = useSupabaseAuth(); // Get the current user
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>(
    initialData || {
      title: "",
      category: "",
      description: "",
      behance_url: "",
      thumbnail_url: "",
      featured: false,
      role: "",
      overview: "",
      objectives: [],
      approach: [],
      images: [],
      designConcept: "",
      finalThoughts: "",
    },
  );

  // Gallery images upload handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        throw new Error("Database connection not available");
      }
      const newImageUrls: string[] = [];

      for (const file of acceptedFiles) {
        // Create a unique file name
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from("project-images")
          .upload(filePath, file);

        if (error) {
          throw error;
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(filePath);

        newImageUrls.push(urlData.publicUrl);
      }

      // Update form data with new images
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImageUrls],
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Thumbnail upload handler
  const onThumbnailDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsThumbnailUploading(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        throw new Error("Database connection not available");
      }
      const file = acceptedFiles[0]; // Only use the first file

      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `thumbnail-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("project-images")
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);

      // Update form data with new thumbnail URL
      setFormData((prev) => ({
        ...prev,
        thumbnail_url: urlData.publicUrl,
      }));
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setError("Failed to upload thumbnail. Please try again.");
    } finally {
      setIsThumbnailUploading(false);
    }
  }, []);

  // Gallery dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  // Thumbnail dropzone setup
  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
    isDragActive: isThumbnailDragActive,
  } = useDropzone({
    onDrop: onThumbnailDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1, // Only allow one file
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = [
        "title",
        "category",
        "description",
        "behance_url",
      ];
      for (const field of requiredFields) {
        if (!formData[field as keyof Project]) {
          throw new Error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          );
        }
      }

      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        throw new Error("Database connection not available");
      }

      // Prepare project data for Supabase
      const projectData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        behance_url: formData.behance_url,
        thumbnail_url: formData.thumbnail_url || null,
        featured: formData.featured || false,
        // Case study fields
        role: formData.role || null,
        overview: formData.overview || null,
        objectives:
          formData.objectives && formData.objectives.length > 0
            ? formData.objectives
            : null,
        approach:
          formData.approach && formData.approach.length > 0
            ? formData.approach
            : null,
        images:
          formData.images && formData.images.length > 0
            ? formData.images
            : null,
        design_concept: formData.designConcept || null,
        final_thoughts: formData.finalThoughts || null,
      };

      // Check if we're updating or creating
      if (initialData?.id) {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", initialData.id);

        if (error) throw new Error(error.message);
      } else {
        // Create new project
        const { error } = await supabase.from("projects").insert([
          {
            ...projectData,
            user_id: user?.id, // Add the user_id field for new projects
          },
        ]);

        if (error) throw new Error(error.message);
      }

      // Success - refresh data and redirect
      router.refresh();

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/projects");
      }
    } catch (err) {
      console.error("Error submitting project:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Basic Information */}
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              placeholder="Project title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              placeholder="e.g. Web Design, Branding"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            value={formData.role || ""}
            onChange={handleChange}
            placeholder="e.g. Graphic Designer, Web Developer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Brief project description"
            rows={2}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="behance_url">Behance URL</Label>
          <Input
            id="behance_url"
            name="behance_url"
            value={formData.behance_url || ""}
            onChange={handleChange}
            placeholder="https://www.behance.net/embed/project/123456"
            required
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <Label>Thumbnail Image</Label>

          {/* Thumbnail Dropzone */}
          <div
            {...getThumbnailRootProps()}
            className={`cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition-colors ${
              isThumbnailDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getThumbnailInputProps()} />
            {isThumbnailDragActive ? (
              <p>Drop the thumbnail here...</p>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p>Drag & drop thumbnail image, or click to select</p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, GIF, WEBP (max 5MB)
                </p>
              </div>
            )}
            {isThumbnailUploading && <p className="mt-2">Uploading...</p>}
          </div>

          {/* Thumbnail Preview */}
          {formData.thumbnail_url && (
            <div className="mt-4">
              <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-md">
                <Image
                  src={formData.thumbnail_url}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, thumbnail_url: "" }));
                  }}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Manual URL input as fallback */}
          <div className="mt-2">
            <Label htmlFor="thumbnail_url" className="text-sm">
              Or enter thumbnail URL manually:
            </Label>
            <Input
              id="thumbnail_url"
              name="thumbnail_url"
              value={formData.thumbnail_url || ""}
              onChange={handleChange}
              placeholder="/img/projects/thumbnail.jpg"
              className="mt-1"
            />
          </div>
        </div>

        {/* Gallery Images */}
        <div className="space-y-4">
          <Label>Project Gallery Images</Label>

          {/* Gallery Dropzone */}
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p>Drag & drop gallery images here, or click to select files</p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, GIF, WEBP (max 5MB)
                </p>
              </div>
            )}
            {isUploading && <p className="mt-2">Uploading...</p>}
          </div>

          {/* Gallery Preview */}
          {formData.images && formData.images.length > 0 && (
            <div className="mt-4">
              <Label className="mb-2 block">Uploaded Gallery Images</Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {formData.images.map((url, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video overflow-hidden rounded-md"
                  >
                    <Image
                      src={url}
                      alt={`Project image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...(formData.images || [])];
                        newImages.splice(index, 1);
                        setFormData((prev) => ({ ...prev, images: newImages }));
                      }}
                      className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manual URL input as fallback */}
          <div className="mt-2">
            <Label htmlFor="manual-images" className="text-sm">
              Or enter gallery image URLs manually:
            </Label>
            <Textarea
              id="manual-images"
              value={formData.images ? formData.images.join("\n") : ""}
              onChange={(e) => {
                const imagesArray = e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0);
                setFormData((prev) => ({ ...prev, images: imagesArray }));
              }}
              placeholder="/img/projects/image1.jpg&#10;/img/projects/image2.jpg&#10;/img/projects/image3.jpg"
              rows={2}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground">
              One image URL per line
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured || false}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="h-4 w-4 rounded-sm border border-primary"
          />
          <Label
            htmlFor="featured"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Featured project
          </Label>
        </div>

        {/* Case Study Information */}
        <h3 className="mt-8 text-lg font-medium">Case Study Information</h3>

        <div className="space-y-2">
          <Label htmlFor="overview">Overview</Label>
          <Textarea
            id="overview"
            name="overview"
            value={formData.overview || ""}
            onChange={handleChange}
            placeholder="Detailed project overview"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="objectives">Objectives</Label>
          <Textarea
            id="objectives"
            name="objectives"
            value={formData.objectives ? formData.objectives.join("\n") : ""}
            onChange={(e) => {
              const objectivesArray = e.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
              setFormData((prev) => ({ ...prev, objectives: objectivesArray }));
            }}
            placeholder="Increase brand awareness&#10;Drive engagement&#10;Establish credibility"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            One objective per line (optional)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="approach">Approach</Label>
          <Textarea
            id="approach"
            name="approach"
            value={formData.approach ? formData.approach.join("\n") : ""}
            onChange={(e) => {
              const approachArray = e.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
              setFormData((prev) => ({ ...prev, approach: approachArray }));
            }}
            placeholder="Conducted market research&#10;Developed wireframes&#10;Created visual designs"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            One approach item per line (optional)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="designConcept">Design Concept</Label>
          <Textarea
            id="designConcept"
            name="designConcept"
            value={formData.designConcept || ""}
            onChange={handleChange}
            placeholder="Explanation of the design concept and decisions"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="finalThoughts">Final Thoughts</Label>
          <Textarea
            id="finalThoughts"
            name="finalThoughts"
            value={formData.finalThoughts || ""}
            onChange={handleChange}
            placeholder="Concluding remarks about the project"
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData?.id
              ? "Update Project"
              : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
