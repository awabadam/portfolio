/**
 * Export utilities for data export to CSV/JSON
 */

export type ExportFormat = "json" | "csv";

interface ExportOptions {
  filename: string;
  format: ExportFormat;
}

/**
 * Convert data to CSV format
 */
function toCSV<T extends Record<string, any>>(data: T[], columns?: string[]): string {
  if (data.length === 0) return "";

  // Use provided columns or extract from first item
  const headers = columns || Object.keys(data[0]);

  // Escape CSV values
  const escapeValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = data.map((row) =>
    headers.map((header) => escapeValue(row[header])).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Download data as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to the specified format
 */
export function exportData<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions,
  columns?: string[]
): void {
  const { filename, format } = options;
  const timestamp = new Date().toISOString().slice(0, 10);
  const fullFilename = `${filename}_${timestamp}`;

  if (format === "json") {
    const content = JSON.stringify(data, null, 2);
    downloadFile(content, `${fullFilename}.json`, "application/json");
  } else {
    const content = toCSV(data, columns);
    downloadFile(content, `${fullFilename}.csv`, "text/csv");
  }
}

/**
 * Export leads data
 */
export function exportLeads(leads: any[], format: ExportFormat = "csv"): void {
  const columns = [
    "id",
    "name",
    "email",
    "phone",
    "source",
    "status",
    "message",
    "project_type",
    "created_at",
  ];

  exportData(leads, { filename: "leads", format }, columns);
}

/**
 * Export conversations data
 */
export function exportConversations(conversations: any[], format: ExportFormat = "csv"): void {
  const columns = [
    "id",
    "session_id",
    "visitor_name",
    "visitor_email",
    "visitor_phone",
    "status",
    "message_count",
    "started_at",
    "ended_at",
  ];

  exportData(conversations, { filename: "conversations", format }, columns);
}

/**
 * Export single conversation with messages
 */
export function exportConversationWithMessages(
  conversation: any,
  messages: any[],
  format: ExportFormat = "json"
): void {
  if (format === "json") {
    const data = {
      conversation,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        created_at: m.created_at,
      })),
    };

    const content = JSON.stringify(data, null, 2);
    const filename = `conversation_${conversation.id.slice(0, 8)}_${new Date().toISOString().slice(0, 10)}`;
    downloadFile(content, `${filename}.json`, "application/json");
  } else {
    // For CSV, flatten messages
    const rows = messages.map((m) => ({
      conversation_id: conversation.id,
      visitor_name: conversation.visitor_name || "",
      visitor_email: conversation.visitor_email || "",
      message_role: m.role,
      message_content: m.content,
      message_time: m.created_at,
    }));

    const columns = [
      "conversation_id",
      "visitor_name",
      "visitor_email",
      "message_role",
      "message_content",
      "message_time",
    ];

    exportData(rows, { filename: `conversation_${conversation.id.slice(0, 8)}`, format }, columns);
  }
}

/**
 * Export projects data
 */
export function exportProjects(projects: any[], format: ExportFormat = "csv"): void {
  const columns = [
    "id",
    "title",
    "category",
    "description",
    "featured",
    "behance_url",
    "created_at",
  ];

  // Flatten technologies array
  const data = projects.map((p) => ({
    ...p,
    technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies,
  }));

  exportData(data, { filename: "projects", format }, columns);
}

/**
 * Export blog posts data
 */
export function exportBlogPosts(posts: any[], format: ExportFormat = "csv"): void {
  const columns = [
    "id",
    "title",
    "slug",
    "category",
    "excerpt",
    "published",
    "view_count",
    "reading_time",
    "created_at",
    "published_at",
  ];

  // Flatten tags array
  const data = posts.map((p) => ({
    ...p,
    tags: Array.isArray(p.tags) ? p.tags.join(", ") : p.tags,
  }));

  exportData(data, { filename: "blog_posts", format }, columns);
}
