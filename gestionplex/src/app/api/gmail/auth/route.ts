import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/gmail";

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      {
        error: "Gmail non configuré",
        message: "Ajoutez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans votre .env.local",
        docs: "https://console.cloud.google.com/apis/credentials",
      },
      { status: 503 }
    );
  }

  const url = getAuthUrl();
  return NextResponse.redirect(url);
}
