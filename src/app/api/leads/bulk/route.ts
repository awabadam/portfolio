import { NextResponse } from "next/server";
import { createAppServerClient } from "@/lib/supabase";
import { bulkLeadUpdateSchema, bulkDeleteSchema } from "@/lib/validation/schemas";

// PATCH - Bulk update lead status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validation = bulkLeadUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { ids, status } = validation.data;
    const supabase = createAppServerClient();

    const { data, error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids)
      .select();

    if (error) {
      console.error("Error bulk updating leads:", error);
      return NextResponse.json(
        { error: "Failed to update leads" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updated: data?.length || 0,
      message: `Updated ${data?.length || 0} leads to "${status}"`,
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
    const body = await request.json();
    const validation = bulkDeleteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { ids } = validation.data;
    const supabase = createAppServerClient();

    const { error, count } = await supabase
      .from("leads")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Error bulk deleting leads:", error);
      return NextResponse.json(
        { error: "Failed to delete leads" },
        { status: 500 }
      );
    }

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
