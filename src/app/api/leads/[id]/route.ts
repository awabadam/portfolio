import { NextResponse } from "next/server";
import { createAppServerClient } from "@/lib/supabase";

// GET - Fetch a single lead
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAppServerClient();

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Error fetching lead:", error);
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    console.error("Error in lead API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update a lead
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes, name, email, phone } = body;

    const supabase = createAppServerClient();

    const updateData: Record<string, any> = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    const { data, error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating lead:", error);
      return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    console.error("Error in lead API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete a lead
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAppServerClient();

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting lead:", error);
      return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in lead API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

