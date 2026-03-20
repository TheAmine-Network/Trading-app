import { NextRequest, NextResponse } from "next/server";
import { updateLogement } from "@/lib/store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  updateLogement(id, body);
  return NextResponse.json({ success: true, id, updates: body });
}
