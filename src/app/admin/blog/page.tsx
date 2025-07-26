"use client";

import React, { useState, useEffect } from "react";
import { BlogPost } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Eye, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { useSupabaseAuth } from "@/lib/hooks/useSupabase";

const BlogAdminPage = () => {
  const { user, supabase } = useSupabaseAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
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
    if (user && supabase) {
      fetchPosts();
    }
  }, [user, supabase]);

  const fetchPosts = async () => {
    if (!supabase) return;

    try {
      console.log("Fetching blog posts...");
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        alert(`Error fetching posts: ${error.message}`);
        return;
      }

      console.log("Posts fetched successfully:", data?.length || 0);
      setPosts(data || []);
    } catch (error) {
      console.error("Error:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) return;

    try {
      console.log("Submitting post data...");
      console.log("Current user:", user?.email);

      const postData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        published_at: formData.published ? new Date().toISOString() : null,
        author_id: user?.id || null,
      };

      console.log("Post data to save:", postData);

      if (editingPost) {
        console.log("Updating existing post:", editingPost.id);
        const { data, error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", editingPost.id)
          .select();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        console.log("Update successful:", data);
      } else {
        console.log("Creating new post");
        const { data, error } = await supabase
          .from("blog_posts")
          .insert([postData])
          .select();

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        console.log("Insert successful:", data);
      }

      setShowForm(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
      alert(
        editingPost
          ? "Post updated successfully!"
          : "Post created successfully!",
      );
    } catch (error) {
      console.error("Error saving post:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save post";
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    if (!supabase) return;

    try {
      console.log("Deleting post:", id);
      const { data, error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      console.log("Delete successful:", data);
      fetchPosts();
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete post";
      alert(`Error: ${errorMessage}`);
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
      reading_time: post.reading_time,
      published: post.published,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold">Loading...</h2>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Blog Posts Management</h1>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingPost ? "Edit Post" : "Create New Post"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="featured_image_url">Featured Image URL</Label>
                  <Input
                    id="featured_image_url"
                    value={formData.featured_image_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured_image_url: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          meta_title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                    <Input
                      id="reading_time"
                      type="number"
                      value={formData.reading_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reading_time: parseInt(e.target.value),
                        })
                      }
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        published: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="published">Published</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingPost ? "Update Post" : "Create Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      {post.published ? (
                        <Badge variant="default">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </div>
                    <p className="mb-2 text-muted-foreground">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.reading_time} min read
                      </div>
                      <span>Category: {post.category}</span>
                      <span>Views: {post.view_count}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-12 text-center">
            <h3 className="mb-4 text-xl font-semibold">No blog posts yet</h3>
            <p className="mb-6 text-muted-foreground">
              Create your first blog post to get started.
            </p>
            <Button onClick={() => setShowForm(true)}>Create First Post</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogAdminPage;
