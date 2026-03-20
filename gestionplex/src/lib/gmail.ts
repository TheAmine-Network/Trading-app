/**
 * Gmail OAuth2 helpers pour GestionPlex
 * Permet la connexion Gmail et l'extraction automatique des données immobilières
 */

import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.labels",
];

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI ?? `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
  );
}

export function getAuthUrl(): string {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

// ─── Email parsers ────────────────────────────────────────────────────────────

export interface EmailExtrait {
  messageId: string;
  sujet: string;
  expediteur: string;
  date: Date;
  type: "LOYER" | "ENTRETIEN" | "BAIL" | "ASSURANCE" | "FACTURE" | "AUTRE";
  montant?: number;
  locataire?: string;
  logement?: string;
  resume: string;
  action?: {
    type: "ENREGISTRER_TRANSACTION" | "CREER_ENTRETIEN" | "RENOUVELER_BAIL";
    donnees: Record<string, unknown>;
  };
}

/**
 * Detecte le type d'email et extrait les informations pertinentes
 * via pattern matching et mots-clés immobiliers
 */
export function analyserEmail(subject: string, body: string, from: string): Omit<EmailExtrait, "messageId" | "date"> {
  const sujetLower = subject.toLowerCase();
  const bodyLower = body.toLowerCase();
  const texte = sujetLower + " " + bodyLower;

  // Paiement de loyer
  if (
    texte.includes("loyer") ||
    texte.includes("rent") ||
    texte.includes("virement") ||
    texte.includes("paiement")
  ) {
    const montant = extraireMontant(texte);
    const locataire = extraireNom(from);

    return {
      sujet: subject,
      expediteur: from,
      type: "LOYER",
      montant,
      locataire,
      resume: `Paiement de loyer${montant ? ` de ${formatCAD(montant)}` : ""} reçu${locataire ? ` de ${locataire}` : ""}`,
      action: montant ? {
        type: "ENREGISTRER_TRANSACTION",
        donnees: {
          type: "REVENU",
          categorie: "LOYER",
          montant,
          description: `Loyer — ${locataire ?? from}`,
        },
      } : undefined,
    };
  }

  // Demande d'entretien
  if (
    texte.includes("réparation") ||
    texte.includes("reparation") ||
    texte.includes("bris") ||
    texte.includes("fuite") ||
    texte.includes("chauffage") ||
    texte.includes("plomberie") ||
    texte.includes("entretien") ||
    texte.includes("problème") ||
    texte.includes("probleme")
  ) {
    const locataire = extraireNom(from);
    const priorite = texte.includes("urgent") || texte.includes("urgence") ? "URGENTE" : "NORMALE";

    return {
      sujet: subject,
      expediteur: from,
      type: "ENTRETIEN",
      locataire,
      resume: `Demande d'entretien de ${locataire ?? from} — priorité ${priorite.toLowerCase()}`,
      action: {
        type: "CREER_ENTRETIEN",
        donnees: {
          titre: subject.replace(/re:\s*/i, "").trim(),
          priorite,
          description: body.substring(0, 300),
          locataire: locataire ?? from,
        },
      },
    };
  }

  // Assurance
  if (texte.includes("assurance") || texte.includes("insurance") || texte.includes("police") && texte.includes("assur")) {
    const montant = extraireMontant(texte);
    return {
      sujet: subject,
      expediteur: from,
      type: "ASSURANCE",
      montant,
      resume: `Document d'assurance${montant ? ` — ${formatCAD(montant)}` : ""}`,
    };
  }

  // Bail
  if (texte.includes("bail") || texte.includes("renouvellement") || texte.includes("lease")) {
    const locataire = extraireNom(from);
    return {
      sujet: subject,
      expediteur: from,
      type: "BAIL",
      locataire,
      resume: `Document de bail — ${locataire ?? from}`,
      action: {
        type: "RENOUVELER_BAIL",
        donnees: { locataire: locataire ?? from },
      },
    };
  }

  // Facture générique
  if (texte.includes("facture") || texte.includes("invoice") || texte.includes("reçu") || texte.includes("recu")) {
    const montant = extraireMontant(texte);
    return {
      sujet: subject,
      expediteur: from,
      type: "FACTURE",
      montant,
      resume: `Facture${montant ? ` de ${formatCAD(montant)}` : ""} de ${extraireNom(from) ?? from}`,
    };
  }

  return {
    sujet: subject,
    expediteur: from,
    type: "AUTRE",
    resume: `Email de ${extraireNom(from) ?? from} — ${subject.substring(0, 80)}`,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extraireMontant(texte: string): number | undefined {
  // Cherche des patterns comme $1,200 | 1200$ | 1 200,00 $ | 1,200.00
  const patterns = [
    /\$\s?(\d{1,4}(?:[,\s]\d{3})*(?:\.\d{2})?)/,
    /(\d{1,4}(?:[,\s]\d{3})*(?:\.\d{2})?)\s?\$/,
    /(\d{1,4}(?:\s\d{3})*(?:,\d{2})?)\s?(?:cad|dollars?)/i,
  ];

  for (const pattern of patterns) {
    const match = texte.match(pattern);
    if (match) {
      const valeur = parseFloat(match[1].replace(/[\s,]/g, "").replace(",", "."));
      if (!isNaN(valeur) && valeur > 10 && valeur < 50000) return valeur;
    }
  }
  return undefined;
}

function extraireNom(from: string): string | undefined {
  // "Prénom Nom <email@example.com>" → "Prénom Nom"
  const match = from.match(/^"?([^"<]+)"?\s*</);
  if (match) return match[1].trim();

  // "email@example.com" → undefined
  if (from.includes("@")) return undefined;

  return from.trim();
}

function formatCAD(montant: number): string {
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" }).format(montant);
}

// ─── Gmail message decoder ────────────────────────────────────────────────────

export function decoderCorpsEmail(message: { payload?: { body?: { data?: string }; parts?: Array<{ mimeType?: string; body?: { data?: string } }> } }): string {
  const payload = message.payload;
  if (!payload) return "";

  // Corps direct
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64url").toString("utf-8");
  }

  // Parties multipart — cherche text/plain puis text/html
  const parts = payload.parts ?? [];
  const textPart = parts.find(p => p.mimeType === "text/plain") ?? parts.find(p => p.mimeType === "text/html");

  if (textPart?.body?.data) {
    return Buffer.from(textPart.body.data, "base64url").toString("utf-8").replace(/<[^>]+>/g, " ");
  }

  return "";
}
