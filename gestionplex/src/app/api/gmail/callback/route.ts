import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "@/lib/gmail";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/parametres?gmail=error&reason=${error}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/parametres?gmail=error&reason=no_code`
    );
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    // Stocker les tokens dans un cookie HttpOnly sécurisé
    // En production, utilisez une base de données chiffrée
    const cookieStore = await cookies();
    cookieStore.set("gmail_tokens", JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/parametres?gmail=connected`
    );
  } catch {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/parametres?gmail=error&reason=token_exchange`
    );
  }
}
