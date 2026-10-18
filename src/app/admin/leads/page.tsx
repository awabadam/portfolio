"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { toast } from "@/components/ui/toaster";
import { exportLeads } from "@/lib/export";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  ClipboardCheck,
  Users,
  UserPlus,
  RefreshCw,
  Download,
  CheckSquare,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

interface Lead {
  id: string;
  source: "whatsapp" | "contact_form" | "newsletter" | "chat" | "clinic_audit" | "playbook";
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  project_type: string | null;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const tierLabels: Record<string, { label: string; color: string }> = {
  hot: { label: "Hot", color: "bg-red-600 text-white" },
  warm: { label: "Warm", color: "bg-amber-100 text-amber-800" },
  cold: { label: "Cold", color: "bg-slate-100 text-slate-700" },
};

const stageLabels: Record<string, string> = {
  website: "website step",
  review: "review of the scan",
  questions: "questions",
  result: "result (score shown, form not sent)",
};

/**
 * "Stopped at" line for a partial clinic audit lead: the visitor left an email on the
 * website step and has not sent the result form (yet). metadata.progress comes from
 * /api/audit/progress.
 */
function AuditPartialProgress({ metadata }: { metadata: Record<string, unknown> }) {
  const p = (metadata.progress ?? null) as Record<string, unknown> | null;
  const stage = typeof p?.stage === "string" ? p.stage : "website";
  const last = (p?.lastStep ?? null) as { n?: unknown; id?: unknown } | null;
  const total = typeof p?.total === "number" ? p.total : null;
  const answered = typeof p?.answered === "number" ? p.answered : 0;
  const where =
    stage === "questions" && last && typeof last.n === "number"
      ? `Question ${last.n}${total ? ` of ${total}` : ""}${typeof last.id === "string" ? ` (${last.id})` : ""}`
      : (stageLabels[stage] ?? stage);
  const at = typeof p?.at === "string" ? new Date(p.at) : null;
  const score = typeof metadata.score === "number" ? metadata.score : null;
  const website = typeof metadata.website === "string" ? metadata.website.replace(/^https?:\/\//, "").replace(/\/$/, "") : null;

  return (
    <div className="mt-2 flex max-w-[360px] flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <Badge variant="outline" className="border-amber-500 text-amber-700" title="Left an email, did not send the result form">
        Partial
      </Badge>
      <span>
        <span className="font-medium text-foreground">Stopped at:</span> {where}
      </span>
      {total !== null && (
        <span>
          {answered}/{total} answered
        </span>
      )}
      {score !== null && <span>Score {score}/100</span>}
      {website && <span>{website}</span>}
      {at && !Number.isNaN(at.getTime()) && (
        <span title={at.toISOString()}>
          last seen {at.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </div>
  );
}

/** Compact profile + qualification line for clinic audit leads (stored in leads.metadata). */
function AuditQualification({ metadata }: { metadata: Record<string, unknown> | null }) {
  if (!metadata) return null;
  const q = (metadata.qualification ?? null) as Record<string, unknown> | null;
  const partial = metadata.partial === true;
  const list = (v: unknown) => (Array.isArray(v) && v.length ? v.join(", ") : null);
  const text = (v: unknown) => (typeof v === "string" && v ? v : null);
  const fields: [string, string | null][] = [
    ["Treats", text(metadata.treatments)],
    ["Markets", list(metadata.markets)],
    ["Volume", text(metadata.volume)],
    ["Role", text(q?.role)],
    ["Channel", list(q?.channel)],
    ["Timeline", text(q?.timeline)],
    ["Budget", text(q?.budgetFit)],
  ];
  const shown = fields.filter((f): f is [string, string] => f[1] !== null);
  const tier = typeof metadata.tier === "string" ? tierLabels[metadata.tier] : undefined;
  // A partial lead may carry only some qualification answers: provisional until all four are in.
  const provisional = partial ? metadata.tierProvisional !== false : !q;
  if (!tier && shown.length === 0) return null;

  return (
    <div className="mt-2 flex max-w-[360px] flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      {tier && (
        <Badge
          className={tier.color}
          title={provisional ? (partial ? "Provisional (stopped before all qualification answers)" : "Provisional (no qualification answers)") : "Qualified"}
        >
          {tier.label}
          {provisional && "?"}
        </Badge>
      )}
      {shown.map(([label, value]) => (
        <span key={label}>
          <span className="font-medium text-foreground">{label}</span> {value}
        </span>
      ))}
    </div>
  );
}

const sourceLabels = {
  whatsapp: { label: "WhatsApp", icon: WhatsAppIcon, color: "bg-[#25D366] text-white" },
  contact_form: { label: "Contact Form", icon: FileText, color: "bg-blue-500 text-white" },
  newsletter: { label: "Newsletter", icon: Mail, color: "bg-purple-500 text-white" },
  chat: { label: "Chat", icon: MessageSquare, color: "bg-orange-500 text-white" },
  clinic_audit: { label: "Clinic Audit", icon: ClipboardCheck, color: "bg-emerald-600 text-white" },
  playbook: { label: "Playbook", icon: FileText, color: "bg-teal-600 text-white" },
};

// Unknown/new sources must never crash the table.
const fallbackSource = { label: "Other", icon: FileText, color: "bg-gray-500 text-white" };

const statusLabels = {
  new: { label: "New", color: "bg-blue-100 text-blue-800" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800" },
  qualified: { label: "Qualified", color: "bg-green-100 text-green-800" },
  converted: { label: "Converted", color: "bg-emerald-100 text-emerald-800" },
  lost: { label: "Lost", color: "bg-red-100 text-red-800" },
};

const PAGE_SIZE = 10;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    whatsapp: 0,
    contactForm: 0,
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sourceFilter !== "all") params.set("source", sourceFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setLeads(data.leads || []);
        const allLeads = data.leads || [];
        setStats({
          total: allLeads.length,
          new: allLeads.filter((l: Lead) => l.status === "new").length,
          whatsapp: allLeads.filter((l: Lead) => l.source === "whatsapp").length,
          contactForm: allLeads.filter((l: Lead) => l.source === "contact_form").length,
        });
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [sourceFilter, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sourceFilter, statusFilter, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Lead status updated to "${newStatus}"`);
        fetchLeads();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;

    try {
      const response = await fetch(`/api/leads/${leadToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Lead deleted successfully");
        fetchLeads();
      } else {
        toast.error("Failed to delete lead");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    } finally {
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedIds.size === 0) return;

    try {
      const response = await fetch("/api/leads/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setSelectedIds(new Set());
        fetchLeads();
      } else {
        toast.error(data.error || "Failed to update leads");
      }
    } catch (error) {
      console.error("Error bulk updating leads:", error);
      toast.error("Failed to update leads");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      const response = await fetch("/api/leads/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setSelectedIds(new Set());
        fetchLeads();
      } else {
        toast.error(data.error || "Failed to delete leads");
      }
    } catch (error) {
      console.error("Error bulk deleting leads:", error);
      toast.error("Failed to delete leads");
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedLeads.map((l) => l.id)));
    }
  };

  const handleExport = (format: "json" | "csv") => {
    exportLeads(leads, format);
    toast.success(`Exported ${leads.length} leads as ${format.toUpperCase()}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination
  const totalPages = Math.ceil(leads.length / PAGE_SIZE);
  const paginatedLeads = leads.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">
              Manage leads from WhatsApp, contact forms, and other sources
            </p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={fetchLeads} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#25D366]">{stats.whatsapp}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Form</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.contactForm}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="contact_form">Contact Form</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="clinic_audit">Clinic Audit</SelectItem>
                  <SelectItem value="playbook">Playbook</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {selectedIds.size} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select onValueChange={handleBulkStatusChange}>
                    <SelectTrigger className="h-8 w-[160px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Mark as New</SelectItem>
                      <SelectItem value="contacted">Mark as Contacted</SelectItem>
                      <SelectItem value="qualified">Mark as Qualified</SelectItem>
                      <SelectItem value="converted">Mark as Converted</SelectItem>
                      <SelectItem value="lost">Mark as Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setBulkDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>
              {leads.length} lead{leads.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No leads yet</h3>
                <p className="text-muted-foreground">
                  Leads will appear here when visitors submit forms or contact you via WhatsApp.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedIds.size === paginatedLeads.length && paginatedLeads.length > 0}
                            onCheckedChange={toggleSelectAll}
                            aria-label="Select all"
                          />
                        </TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLeads.map((lead) => {
                        const source = sourceLabels[lead.source] ?? fallbackSource;
                        const status = statusLabels[lead.status];
                        const SourceIcon = source.icon;

                        return (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.has(lead.id)}
                                onCheckedChange={() => toggleSelect(lead.id)}
                                aria-label={`Select ${lead.name || lead.email || "lead"}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Badge className={source.color}>
                                <SourceIcon className="mr-1 h-3 w-3" />
                                {source.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {lead.name && (
                                  <p className="font-medium">{lead.name}</p>
                                )}
                                {lead.email && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    {lead.email}
                                  </div>
                                )}
                                {lead.phone && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    {lead.phone}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="max-w-[300px] truncate text-sm text-muted-foreground">
                                {lead.message || lead.project_type || "—"}
                              </p>
                              {lead.source === "clinic_audit" && lead.metadata?.partial === true && (
                                <AuditPartialProgress metadata={lead.metadata} />
                              )}
                              {lead.source === "clinic_audit" && <AuditQualification metadata={lead.metadata} />}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={lead.status}
                                onValueChange={(value) => handleStatusChange(lead.id, value)}
                              >
                                <SelectTrigger className="h-8 w-[130px]">
                                  <Badge className={status.color}>{status.label}</Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="contacted">Contacted</SelectItem>
                                  <SelectItem value="qualified">Qualified</SelectItem>
                                  <SelectItem value="converted">Converted</SelectItem>
                                  <SelectItem value="lost">Lost</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(lead.created_at)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {lead.phone && (
                                    <DropdownMenuItem asChild>
                                      <a
                                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <WhatsAppIcon className="mr-2 h-4 w-4 text-[#25D366]" />
                                        Message on WhatsApp
                                      </a>
                                    </DropdownMenuItem>
                                  )}
                                  {lead.email && (
                                    <DropdownMenuItem asChild>
                                      <a href={`mailto:${lead.email}`}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Email
                                      </a>
                                    </DropdownMenuItem>
                                  )}
                                  {lead.phone && (
                                    <DropdownMenuItem asChild>
                                      <a href={`tel:${lead.phone}`}>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call
                                      </a>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setLeadToDelete(lead.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <PaginationInfo
                      currentPage={currentPage}
                      pageSize={PAGE_SIZE}
                      totalItems={leads.length}
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
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

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Leads</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected leads? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedIds.size} Leads
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
