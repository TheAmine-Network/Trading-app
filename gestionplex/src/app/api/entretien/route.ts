import { NextRequest, NextResponse } from "next/server";
import { addDemandeEntretien } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const demande = {
    id: `dem_${Date.now()}`,
    statut: "NOUVELLE",
    priorite: "NORMALE",
    ...body,
  };
  addDemandeEntretien(demande);
  return NextResponse.json({ success: true, demande });
}
