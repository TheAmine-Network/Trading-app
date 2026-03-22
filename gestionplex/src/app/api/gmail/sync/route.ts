import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getOAuth2Client, analyserEmail, decoderCorpsEmail, type EmailExtrait } from "@/lib/gmail";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
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

// ─── Données de démonstration ─────────────────────────────────────────────────

function getEmailsDemo(): EmailExtrait[] {
  const now = new Date();
  const il_y_a = (jours: number) => new Date(now.getTime() - jours * 86400000);

  return [
    {
      messageId: "demo_1",
      sujet: "Paiement loyer mars 2025",
      expediteur: "Sophie Tremblay <sophie.tremblay@gmail.com>",
      date: il_y_a(1),
      type: "LOYER",
      montant: 1450,
      locataire: "Sophie Tremblay",
      logement: "Rez-de-chaussée",
      resume: "Paiement de loyer de 1 450,00 $ CA reçu de Sophie Tremblay",
      action: {
        type: "ENREGISTRER_TRANSACTION",
        donnees: {
          type: "REVENU",
          categorie: "LOYER",
          montant: 1450,
          description: "Loyer mars — Sophie Tremblay",
        },
      },
    },
    {
      messageId: "demo_2",
      sujet: "Fuite d'eau sous le lavabo — URGENT",
      expediteur: "Jean-Marc Dubois <jm.dubois@hotmail.com>",
      date: il_y_a(0),
      type: "ENTRETIEN",
      locataire: "Jean-Marc Dubois",
      resume: "Demande d'entretien de Jean-Marc Dubois — priorité urgente",
      action: {
        type: "CREER_ENTRETIEN",
        donnees: {
          titre: "Fuite d'eau sous le lavabo",
          priorite: "URGENTE",
          description: "Il y a une fuite sous le lavabo de la salle de bain. L'eau coule en permanence. Besoin d'intervention urgente.",
          locataire: "Jean-Marc Dubois",
        },
      },
    },
    {
      messageId: "demo_3",
      sujet: "Renouvellement bail 2025-2026 — Appartement 2",
      expediteur: "Marie Côté <marie.cote@outlook.com>",
      date: il_y_a(3),
      type: "BAIL",
      locataire: "Marie Côté",
      resume: "Document de bail — Marie Côté",
      action: {
        type: "RENOUVELER_BAIL",
        donnees: { locataire: "Marie Côté" },
      },
    },
    {
      messageId: "demo_4",
      sujet: "Virement loyer de 1 200 $",
      expediteur: "Alex Nguyen <alex.nguyen@gmail.com>",
      date: il_y_a(2),
      type: "LOYER",
      montant: 1200,
      locataire: "Alex Nguyen",
      resume: "Paiement de loyer de 1 200,00 $ CA reçu de Alex Nguyen",
      action: {
        type: "ENREGISTRER_TRANSACTION",
        donnees: {
          type: "REVENU",
          categorie: "LOYER",
          montant: 1200,
          description: "Loyer mars — Alex Nguyen",
        },
      },
    },
    {
      messageId: "demo_5",
      sujet: "Facture électricité — Triplex Laval Hébert",
      expediteur: "Hydro-Québec <no-reply@hydroquebec.com>",
      date: il_y_a(5),
      type: "FACTURE",
      montant: 342.80,
      resume: "Facture de 342,80 $ CA de Hydro-Québec",
    },
    {
      messageId: "demo_6",
      sujet: "Renouvellement assurance habitation proprietaire",
      expediteur: "Intact Assurance <info@intact.ca>",
      date: il_y_a(7),
      type: "ASSURANCE",
      montant: 1890,
      resume: "Document d'assurance — 1 890,00 $ CA",
    },
  ];
}
