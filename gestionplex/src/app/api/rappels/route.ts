import { NextRequest, NextResponse } from "next/server";
import { addRappel } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const rappel = {
    id: `rap_${Date.now()}`,
    statut: "ACTIF",
    ...body,
    date: body.date ?? new Date().toISOString(),
  };
  addRappel(rappel);
  return NextResponse.json({ success: true, rappel });
}
