import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { getSession } from "@/lib/auth/server";
import { bulkLeadUpdateSchema, bulkDeleteSchema } from "@/lib/validation/schemas";

// PATCH - Bulk update lead status
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = bulkLeadUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { ids, status } = validation.data;

    let data;
    try {
      data = await db
        .update(leads)
        .set({ status, updated_at: new Date() })
        .where(inArray(leads.id, ids))
        .returning();
    } catch (error) {
      console.error("Error bulk updating leads:", error);
      return NextResponse.json(
        { error: "Failed to update leads" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updated: data.length,
      message: `Updated ${data.length} leads to "${status}"`,
    });
  } catch (error) {
    console.error("Error in bulk update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Bulk delete leads
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = bulkDeleteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { ids } = validation.data;

    let deleted;
    try {
      deleted = await db
        .delete(leads)
        .where(inArray(leads.id, ids))
        .returning({ id: leads.id });
    } catch (error) {
      console.error("Error bulk deleting leads:", error);
      return NextResponse.json(
        { error: "Failed to delete leads" },
        { status: 500 }
      );
    }

    const count = deleted.length;

    return NextResponse.json({
      success: true,
      deleted: count || ids.length,
      message: `Deleted ${count || ids.length} leads`,
    });
  } catch (error) {
    console.error("Error in bulk delete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
