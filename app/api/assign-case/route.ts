import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/supabaseClient";
export async function POST(request: NextRequest) {
  try {
    const { reportId, officerId } = await request.json();

    // Validate UUIDs
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!reportId || !uuidRegex.test(reportId)) {
      return NextResponse.json({ error: "Invalid or missing report ID" }, { status: 400 });
    }
    if (!officerId || !uuidRegex.test(officerId)) {
      return NextResponse.json({ error: "Invalid or missing officer ID" }, { status: 400 });
    }

    // Update the assigned_officer in the crime_reports table
    const { data, error } = await supabase
      .from("crime_reports")
      .update({ assigned_officer: officerId })
      .eq("id", reportId)
      .eq("assigned_officer", null); // Ensure the case is unassigned before assignment

    if (error) throw error;

    return NextResponse.json({ message: "Case assigned successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error assigning case:", err);
    return NextResponse.json({ error: "Failed to assign case" }, { status: 500 });
  }
}