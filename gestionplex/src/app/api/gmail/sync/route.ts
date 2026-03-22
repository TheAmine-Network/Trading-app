import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getOAuth2Client, analyserEmail, decoderCorpsEmail, type EmailExtrait } from "@/lib/gmail";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const tokensRaw = cookieStore.get("gmail_tokens")?.value;

  if (!tokensRaw) {
    return NextResponse.json({ error: "Gmail non connecté", connected: false }, { status: 401 });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: "Gmail non configuré", connected: false }, { status: 401 });
  }

  try {
    const tokens = JSON.parse(tokensRaw);
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Cherche les 20 derniers emails
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: 20,
      q: "loyer OR entretien OR bail OR réparation OR assurance OR facture",
    });

    const messages = listResponse.data.messages ?? [];

    const emails: EmailExtrait[] = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "full",
        });

        const headers = detail.data.payload?.headers ?? [];
        const getHeader = (name: string) =>
          headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";

        const subject = getHeader("Subject");
        const from = getHeader("From");
        const dateHeader = getHeader("Date");
        const body = decoderCorpsEmail(detail.data as Parameters<typeof decoderCorpsEmail>[0]);

        const analyse = analyserEmail(subject, body, from);

        return {
          messageId: msg.id!,
          date: new Date(dateHeader),
          ...analyse,
        };
      })
    );

    // Rafraîchir les tokens si nécessaire
    if (oauth2Client.credentials.access_token !== tokens.access_token) {
      cookieStore.set("gmail_tokens", JSON.stringify(oauth2Client.credentials), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
      });
    }

    return NextResponse.json({ emails, connected: true, source: "gmail" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message, connected: false }, { status: 500 });
  }
}

