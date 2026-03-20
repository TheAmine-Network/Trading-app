import { NextRequest, NextResponse } from "next/server";
import { updateDemandeEntretien } from "@/lib/store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const overrides: Record<string, unknown> = {};
  if (body.statut !== undefined) overrides.statut = body.statut;
  if (body.notes !== undefined) overrides.notes = body.notes;
  if (body.cout !== undefined) overrides.cout = body.cout;
  if (body.fournisseurAssigne !== undefined) overrides.fournisseurAssigne = body.fournisseurAssigne;

  if (body.statut === "TERMINEE") {
    overrides.dateFermeture = new Date().toISOString();
  }

  updateDemandeEntretien(id, overrides as Parameters<typeof updateDemandeEntretien>[1]);

  return NextResponse.json({ success: true, id, ...overrides });
}
