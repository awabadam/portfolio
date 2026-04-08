"use client";

import React, { useState, useEffect } from "react";
import { BlogPost } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toaster";
import { blogPostSchema, getValidationErrors } from "@/lib/validation/schemas";
import {
  Plus, Edit, Trash2, Eye, Calendar, Clock, X, Search,
  FileText, CheckCircle, AlertCircle, ArrowLeft, Image,
} from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { useSupabaseAuth } from "@/hooks/useSupabase";
import { z } from "zod";

type FilterTab = "all" | "published" | "drafts";
type LocaleFilter = "all" | "en" | "tr" | "ar" | "fr";

const localeLabels: Record<string, string> = {
  en: "EN", tr: "TR", ar: "AR", fr: "FR",
};
const localeFlags: Record<string, string> = {
  en: "🇬🇧", tr: "🇹🇷", ar: "🇸🇦", fr: "🇫🇷",
};

const BlogAdminPage = () => {
  const { user, supabase } = useSupabaseAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<FilterTab>("all");
  const [localeFilter, setLocaleFilter] = useState<LocaleFilter>("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    featured_image_url: "",
    meta_title: "",
    meta_description: "",
    reading_time: 5,
    published: false,
  });

  useEffect(() => {
    if (user && supabase) fetchPosts();
  }, [user, supabase]);

  const fetchPosts = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) { toast.error(error.message); return; }
      setPosts(data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      filter === "all" ||
      (filter === "published" && post.published) ||
      (filter === "drafts" && !post.published);
    const matchesLocale =
      localeFilter === "all" || (post.locale || "en") === localeFilter;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesLocale && matchesSearch;
  });

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  const validateForm = () => {
    try {
      blogPostSchema.parse({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || undefined,
        content: formData.content,
        coverImage: formData.featured_image_url || undefined,
        published: formData.published,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      });
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors(getValidationErrors(error));
        toast.error(error.issues[0]?.message || "Validation failed");
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !validateForm()) return;

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        published_at: formData.published ? new Date().toISOString() : null,
        author_id: user?.id || null,
      };

      if (editingPost) {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", editingPost.id);
        if (error) throw error;
        toast.success("Post updated!");
      } else {
        const { error } = await supabase.from("blog_posts").insert([postData]);
        if (error) throw error;
        toast.success("Post created!");
      }

      setShowForm(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    }
  };

  const handleQuickPublish = async (post: BlogPost) => {
    if (!supabase) return;
    const newState = !post.published;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        published: newState,
        published_at: newState ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    if (error) { toast.error(error.message); return; }
    toast.success(newState ? "Published!" : "Unpublished");
    fetchPosts();
  };

  const handleDelete = async () => {
    if (!postToDelete || !supabase) return;
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", postToDelete);
      if (error) throw error;
      toast.success("Post deleted!");
      fetchPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(", "),
      featured_image_url: post.featured_image_url || "",
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      reading_time: post.reading_time || 5,
      published: post.published,
    });
    setFieldErrors({});
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "", slug: "", excerpt: "", content: "", category: "", tags: "",
      featured_image_url: "", meta_title: "", meta_description: "", reading_time: 5, published: false,
    });
    setFieldErrors({});
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  // Editor view
  if (showForm) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setShowForm(false); setEditingPost(null); resetForm(); }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {editingPost ? "Edit Post" : "New Post"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="pub"
                checked={formData.published}
                onCheckedChange={(c) => setFormData({ ...formData, published: c as boolean })}
              />
              <Label htmlFor="pub" className="text-sm">Publish</Label>
            </div>
            <Button onClick={handleSubmit}>
              {editingPost ? "Update" : "Create"}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Input
                placeholder="Post title..."
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: editingPost ? formData.slug : generateSlug(title),
                  });
                }}
                className={`border-0 bg-transparent text-3xl font-bold placeholder:text-muted-foreground/40 focus-visible:ring-0 px-0 ${fieldErrors.title ? "text-destructive" : ""}`}
              />
              <p className="mt-1 font-mono text-xs text-muted-foreground">/{formData.slug || "slug"}</p>
            </div>

            {/* Cover image preview */}
            {formData.featured_image_url && (
              <div className="relative overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.featured_image_url}
                  alt="Cover"
                  className="h-48 w-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setFormData({ ...formData, featured_image_url: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Excerpt */}
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Excerpt</Label>
              <Textarea
                placeholder="A brief summary of the post..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="mt-1 resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Content (Markdown)</Label>
              <Textarea
                placeholder="Write your post in markdown..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={20}
                className="mt-1 font-mono text-sm"
              />
            </div>

            {/* Metadata grid */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Post Settings</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Web Design"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Tags (comma-separated)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="seo, web design, tips"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Cover Image URL</Label>
                  <Input
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Reading Time (min)</Label>
                  <Input
                    type="number"
                    value={formData.reading_time}
                    onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) || 5 })}
                    min="1"
                    className="mt-1"
                  />
                </div>
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground pt-2">SEO</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Meta Title</Label>
                  <Input
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder={formData.title || "SEO title"}
                    className="mt-1"
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">{(formData.meta_title || formData.title).length}/60</p>
                </div>
                <div>
                  <Label className="text-xs">Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Meta Description</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="SEO description..."
                  rows={2}
                  className="mt-1 resize-none"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">{formData.meta_description.length}/155</p>
              </div>
            </div>
          </form>
        </div>
      </AdminLayout>
    );
  }

  // List view
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog</h1>
            <p className="text-sm text-muted-foreground">
              {posts.length} posts — {publishedCount} published, {draftCount} drafts
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> New Post
          </Button>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex rounded-lg border bg-muted/30 p-1">
            {(["all", "published", "drafts"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === tab ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "all" ? `All (${posts.length})` : tab === "published" ? `Published (${publishedCount})` : `Drafts (${draftCount})`}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border bg-muted/30 p-1">
            {(["all", "en", "tr", "ar", "fr"] as LocaleFilter[]).map((loc) => (
              <button
                key={loc}
                onClick={() => setLocaleFilter(loc)}
                className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  localeFilter === loc ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {loc === "all" ? "All" : `${localeFlags[loc]} ${localeLabels[loc]}`}
              </button>
            ))}
          </div>
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Posts list */}
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden transition-colors hover:border-primary/20">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Thumbnail */}
                  {post.featured_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.featured_image_url}
                      alt=""
                      className="hidden h-32 w-40 shrink-0 object-cover sm:block"
                    />
                  ) : (
                    <div className="hidden h-32 w-40 shrink-0 items-center justify-center bg-muted sm:flex">
                      <Image className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-1 items-start justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-[11px]">
                          {localeFlags[post.locale || "en"]} {localeLabels[post.locale || "en"]}
                        </Badge>
                        {post.published ? (
                          <Badge variant="default" className="gap-1 bg-green-600 text-[11px]">
                            <CheckCircle className="h-3 w-3" /> Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 text-[11px]">
                            <AlertCircle className="h-3 w-3" /> Draft
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[11px]">{post.category}</Badge>
                      </div>
                      <h3 className="font-semibold leading-tight">{post.title}</h3>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{post.excerpt}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.reading_time} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count} views
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-col gap-1">
                      <Button
                        variant={post.published ? "outline" : "default"}
                        size="sm"
                        className="text-xs"
                        onClick={() => handleQuickPublish(post)}
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(post)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => { setPostToDelete(post.id); setDeleteDialogOpen(true); }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="font-semibold">
              {searchQuery ? "No posts match your search" : "No posts yet"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Create your first post to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowForm(true)} className="mt-4">Create Post</Button>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default BlogAdminPage;
