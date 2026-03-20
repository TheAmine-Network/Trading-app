import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import {
  immeubles,
  logements,
  locataires,
  transactions,
  demandesEntretien,
  rappels,
  getStatsFinancieresMois,
  getTauxOccupation,
} from "@/lib/mock-data";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Tu es **Plex**, l'assistant IA de GestionPlex — une application de gestion immobilière pour des propriétaires montréalais.

Tu aides le propriétaire (Amine) à :
- Consulter rapidement des informations sur ses immeubles, locataires, finances et entretien
- Enregistrer des données (transactions, demandes d'entretien, rappels)
- Analyser la performance de son portefeuille immobilier
- Répondre à des questions sur ses baux, locataires, et paiements

## Ton comportement
- Réponds en français (canadien), de façon concise et professionnelle
- Si une question porte sur des données, utilise les outils disponibles pour y répondre
- Propose des actions concrètes quand pertinent (ex: "Je peux enregistrer ce paiement directement")
- Sois proactif : si tu vois une anomalie (loyer en retard, entretien urgent), signale-le
- Utilise des emojis avec parcimonie pour structurer l'info

## Format des réponses
- Préfère les listes et tableaux pour les données
- Pour les montants : format 1 450,00 $ CA
- Pour les dates : format "15 mars 2025" ou "il y a 2 jours"
- Sois bref mais complet

## Ce que tu NE peux PAS faire
- Modifier la base de données directement (seulement suggérer des actions)
- Accéder à des données extérieures à GestionPlex
- Prendre des décisions financières ou légales
`;

// ─── Outils disponibles ───────────────────────────────────────────────────────

const tools: Groq.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_stats_overview",
      description: "Obtenir un résumé global : taux d'occupation, revenus du mois, dépenses, profit net, nb de demandes d'entretien ouvertes",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "search_tenants",
      description: "Chercher des locataires par nom, statut, ou immeuble",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Nom ou partie du nom du locataire" },
          statut: { type: "string", enum: ["ACTIF", "ANCIEN", "EN_ATTENTE"], description: "Filtrer par statut" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_finances",
      description: "Obtenir les transactions financières récentes, revenus et dépenses par période",
      parameters: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["REVENU", "DEPENSE", "TOUS"], description: "Type de transactions" },
          categorie: { type: "string", description: "Catégorie (LOYER, REPARATION, etc.)" },
          limit: { type: "number", description: "Nombre de transactions à retourner (défaut: 10)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_maintenance",
      description: "Lister les demandes d'entretien actives ou par statut/priorité",
      parameters: {
        type: "object",
        properties: {
          statut: { type: "string", enum: ["NOUVELLE", "EN_COURS", "EN_ATTENTE_PIECE", "TERMINEE", "ANNULEE", "OUVERTES"], description: "Filtrer par statut" },
          priorite: { type: "string", enum: ["URGENTE", "HAUTE", "NORMALE", "BASSE"], description: "Filtrer par priorité" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_buildings",
      description: "Obtenir des informations sur les immeubles et logements",
      parameters: {
        type: "object",
        properties: {
          immeubleId: { type: "string", description: "ID de l'immeuble spécifique (optionnel)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "prepare_action",
      description: "Préparer une action à effectuer (transaction, entretien, rappel) — retourne les données formatées pour l'utilisateur",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["NOUVELLE_TRANSACTION", "NOUVELLE_ENTRETIEN", "NOUVEAU_RAPPEL"],
            description: "Type d'action",
          },
          donnees: {
            type: "object",
            description: "Données de l'action (montant, locataire, description, etc.)",
          },
        },
        required: ["type", "donnees"],
      },
    },
  },
];

// ─── Exécution des outils ─────────────────────────────────────────────────────

function executerOutil(name: string, input: Record<string, unknown>): string {
  switch (name) {
    case "get_stats_overview": {
      const now = new Date();
      const stats = getStatsFinancieresMois(now.getFullYear(), now.getMonth());
      const { nbOccupes, nbTotal, taux } = getTauxOccupation();
      const ouvertes = demandesEntretien.filter(d => !["TERMINEE", "ANNULEE"].includes(d.statut));
      const urgentes = ouvertes.filter(d => d.priorite === "URGENTE");

      return JSON.stringify({
        occupation: { nbOccupes, nbTotal, taux: `${taux}%` },
        finances: {
          revenus: stats.revenus,
          depenses: stats.depenses,
          profit: stats.profit,
          mois: now.toLocaleDateString("fr-CA", { month: "long", year: "numeric" }),
        },
        entretien: {
          demandesOuvertes: ouvertes.length,
          urgentes: urgentes.length,
          details: urgentes.map(d => ({ titre: d.titre, priorite: d.priorite })),
        },
        rappels: rappels.filter(r => r.statut === "ACTIF").length,
      });
    }

    case "search_tenants": {
      const { query, statut } = input as { query?: string; statut?: string };
      let resultats = [...locataires];
      if (query) {
        const q = query.toLowerCase();
        resultats = resultats.filter(l =>
          l.prenom.toLowerCase().includes(q) ||
          l.nom.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q)
        );
      }
      if (statut) resultats = resultats.filter(l => l.statut === statut);
      return JSON.stringify(resultats.map(l => ({
        id: l.id,
        nom: `${l.prenom} ${l.nom}`,
        statut: l.statut,
        email: l.email,
        telephone: l.telephone,
        logementId: l.logementId,
      })));
    }

    case "get_finances": {
      const { type, categorie, limit = 10 } = input as { type?: string; categorie?: string; limit?: number };
      let txs = [...transactions];
      if (type && type !== "TOUS") txs = txs.filter(t => t.type === type);
      if (categorie) txs = txs.filter(t => t.categorie === categorie);
      txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      txs = txs.slice(0, limit);
      const totalRevenus = txs.filter(t => t.type === "REVENU").reduce((s, t) => s + t.montant, 0);
      const totalDepenses = txs.filter(t => t.type === "DEPENSE").reduce((s, t) => s + t.montant, 0);
      return JSON.stringify({
        transactions: txs.map(t => ({
          id: t.id,
          date: new Date(t.date).toLocaleDateString("fr-CA"),
          type: t.type,
          categorie: t.categorie,
          montant: t.montant,
          description: t.description,
        })),
        totaux: { revenus: totalRevenus, depenses: totalDepenses },
      });
    }

    case "get_maintenance": {
      const { statut, priorite } = input as { statut?: string; priorite?: string };
      let demandes = [...demandesEntretien];
      if (statut === "OUVERTES") {
        demandes = demandes.filter(d => !["TERMINEE", "ANNULEE"].includes(d.statut));
      } else if (statut) {
        demandes = demandes.filter(d => d.statut === statut);
      }
      if (priorite) demandes = demandes.filter(d => d.priorite === priorite);
      demandes.sort((a, b) => {
        const ordre = ["URGENTE", "HAUTE", "NORMALE", "BASSE"];
        return ordre.indexOf(a.priorite) - ordre.indexOf(b.priorite);
      });
      return JSON.stringify(demandes.map(d => {
        const log = logements.find(l => l.id === d.logementId);
        const imm = immeubles.find(i => i.id === log?.immeubleId);
        return {
          id: d.id,
          titre: d.titre,
          statut: d.statut,
          priorite: d.priorite,
          categorie: d.categorie,
          description: d.description,
          immeuble: imm?.nom,
          logement: log?.numero,
          date: new Date(d.createdAt).toLocaleDateString("fr-CA"),
        };
      }));
    }

    case "get_buildings": {
      const { immeubleId } = input as { immeubleId?: string };
      const imms = immeubleId ? immeubles.filter(i => i.id === immeubleId) : immeubles;
      return JSON.stringify(imms.map(i => {
        const logs = logements.filter(l => l.immeubleId === i.id);
        const occupes = logs.filter(l => l.statut === "OCCUPE");
        const revenusMensuels = occupes.reduce((s, l) => s + l.loyerMensuel, 0);
        return {
          id: i.id,
          nom: i.nom,
          adresse: i.adresse,
          type: i.type,
          nbLogements: logs.length,
          nbOccupes: occupes.length,
          tauxOccupation: `${Math.round((occupes.length / logs.length) * 100)}%`,
          revenusMensuels,
          valeurMunicipale: i.valeurMunicipale,
          logements: logs.map(l => ({
            id: l.id,
            numero: l.numero,
            statut: l.statut,
            loyer: l.loyerMensuel,
            superficie: l.superficie,
          })),
        };
      }));
    }

    case "prepare_action": {
      const { type, donnees } = input as { type: string; donnees: Record<string, unknown> };
      return JSON.stringify({
        actionPreparee: type,
        donnees,
        message: "Voici les données préparées. Confirmez pour les enregistrer.",
        confirmationRequise: true,
      });
    }

    default:
      return JSON.stringify({ error: `Outil inconnu: ${name}` });
  }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const { messages } = await request.json() as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!messages || !Array.isArray(messages)) {
    return new Response("Messages invalides", { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({
        content: "⚠️ Clé API Groq manquante. Créez un compte gratuit sur groq.com et ajoutez `GROQ_API_KEY` dans `.env.local`.",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let currentMessages: Groq.Chat.ChatCompletionMessageParam[] = [
          ...messages.map(m => ({ role: m.role, content: m.content } as Groq.Chat.ChatCompletionMessageParam)),
        ];

        // Boucle agent avec outils
        while (true) {
          const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            max_tokens: 1024,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...currentMessages,
            ],
            tools,
            tool_choice: "auto",
          });

          const choice = response.choices[0];

          if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
            const toolCalls = choice.message.tool_calls;

            currentMessages = [
              ...currentMessages,
              { role: "assistant", content: choice.message.content ?? "", tool_calls: toolCalls },
            ];

            for (const toolCall of toolCalls) {
              let input: Record<string, unknown> = {};
              try { input = JSON.parse(toolCall.function.arguments); } catch { /* ignore */ }

              const result = executerOutil(toolCall.function.name, input);
              currentMessages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: result,
              });
            }
          } else {
            const text = choice.message.content ?? "";
            controller.enqueue(encoder.encode(JSON.stringify({ content: text })));
            break;
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        controller.enqueue(encoder.encode(JSON.stringify({ error: message })));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/json" },
  });
}
