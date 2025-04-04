import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { supabase } from "@/supabase/supabaseClient";


export async function POST(req: Request) {
  try {
    const { email, password, role, phone, badge_number, station_id, name, contact_number, address } = await req.json();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into user table
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([{ email, password_hash: hashedPassword, role, phone }])
      .select()
      .single();

    if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });

    if (role === "OFFICER") {
      // Ensure station exists before assigning officer
      const { data: station, error: stationError } = await supabase
        .from("police_stations")
        .select("id")
        .eq("id", station_id)
        .single();

      if (stationError || !station) return NextResponse.json({ error: "Invalid station ID" }, { status: 400 });

      await supabase.from("police_officers").insert([{ badge_number, user_id: user.id, station_id }]);
    } else if (role === "POLICE_STATION") {
      await supabase.from("police_stations").insert([{ name, contact_number, address, user_id: user.id }]);
    }

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
