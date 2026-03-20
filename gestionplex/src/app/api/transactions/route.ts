import { NextRequest, NextResponse } from "next/server";
import { addTransaction } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const tx = {
    id: `tx_${Date.now()}`,
    ...body,
    date: body.date ?? new Date().toISOString(),
  };
  addTransaction(tx);
  return NextResponse.json({ success: true, transaction: tx });
}
