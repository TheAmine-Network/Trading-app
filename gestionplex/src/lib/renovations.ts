/**
 * Données de rénovation — Duplex Anjou (8450-8452 av. Sublaines)
 *
 * Structure centralisée pour suivre tous les travaux planifiés,
 * les coûts estimés vs réels, et les subventions disponibles.
 */

export type StatutTravail =
  | "PLANIFIE"
  | "EN_COURS"
  | "DEVIS_RECU"
  | "COMMANDE"
  | "TERMINE"
  | "ANNULE";

export type CategorieTravail =
  | "PLANCHERS"
  | "SALLE_DE_BAIN"
  | "CUISINE"
  | "ELECTRICITE"
  | "CHAUFFAGE"
  | "EXTERIEUR"
  | "AUTRE";

export interface Subvention {
  programme: string;
  organisme: string;
  montantMax: number;
  description: string;
  conditions: string;
  urlInfo: string;
  eligible: boolean;
  montantEstime?: number;
}

export interface TravailRenovation {
  id: string;
  immeubleId: string;
  /** null = immeuble entier */
  logementId: string | null;
  titre: string;
  description: string;
  categorie: CategorieTravail;
  statut: StatutTravail;
  priorite: 1 | 2 | 3; // 1 = urgent, 2 = important, 3 = souhaitable
  /** Estimation basse */
  coutMin: number;
  /** Estimation haute */
  coutMax: number;
  /** Coût réel une fois terminé */
  coutReel?: number;
  /** Montant de subvention reçu */
  subventionRecue?: number;
  fournisseur?: string;
  dateDebut?: Date;
  dateFin?: Date;
  notes?: string;
  subventionsDisponibles?: Subvention[];
}

// ─── Subventions pour conversion chauffage mazout ────────────────────────────

const SUBVENTIONS_MAZOUT: Subvention[] = [
  {
    programme: "Rénoclimat — conversion énergétique",
    organisme: "Transition énergétique Québec (TEQ)",
    montantMax: 3000,
    description:
      "Aide financière pour remplacer un système de chauffage à combustibles fossiles par une thermopompe centrale ou bizone.",
    conditions:
      "Propriétaire occupant ou locateur. Doit remplacer un système mazout, propane ou gaz. Thermopompe certifiée ENERGY STAR.",
    urlInfo: "https://www.renoclimat.com",
    eligible: true,
    montantEstime: 2500,
  },
  {
    programme: "Thermopompe haute efficacité — Hydro-Québec",
    organisme: "Hydro-Québec",
    montantMax: 2000,
    description:
      "Rabais à l'achat pour une thermopompe bi-énergie ou thermopompe centrale haute efficacité.",
    conditions:
      "Propriété branchée à Hydro-Québec. Remplacement d'un système au mazout ou à l'huile de chauffage.",
    urlInfo: "https://www.hydroquebec.com/residentiel/mieux-vivre/economies-energie/thermopompe.html",
    eligible: true,
    montantEstime: 1500,
  },
  {
    programme: "Programme Chauffer vert — Province de Québec",
    organisme: "Gouvernement du Québec (MRN)",
    montantMax: 2000,
    description:
      "Aide à la conversion du mazout vers une source d'énergie renouvelable ou moins polluante.",
    conditions: "Résidence principale ou immeuble locatif de 4 logements et moins.",
    urlInfo: "https://www.quebec.ca/logement/ameliorer-logement/subventions-renovation",
    eligible: true,
    montantEstime: 1500,
  },
  {
    programme: "Crédit canadien pour rénovations écoénergétiques (CCRÉ)",
    organisme: "Gouvernement du Canada (CRA)",
    montantMax: 4500,
    description:
      "Crédit d'impôt non remboursable de 15% sur les dépenses admissibles jusqu'à 30 000 $ pour l'efficacité énergétique.",
    conditions:
      "Propriétaire d'un logement admissible au Canada. Travaux réalisés par un professionnel certifié.",
    urlInfo: "https://www.canada.ca/fr/agence-revenu/services/credits-impot/renovations-ecologiques.html",
    eligible: true,
    montantEstime: 2250, // 15% × ~15,000$ (coût thermopompe)
  },
  {
    programme: "Éconologis (évaluation gratuite)",
    organisme: "Transition énergétique Québec / Hydro-Québec",
    montantMax: 0,
    description:
      "Évaluation énergétique gratuite de la maison + recommandations pour maximiser les aides financières disponibles.",
    conditions: "Ouvert à tous les ménages québécois propriétaires.",
    urlInfo: "https://www.econologis.com",
    eligible: true,
    montantEstime: 0,
  },
];

// ─── Travaux du Duplex Anjou ──────────────────────────────────────────────────

export const travauxAnjou: TravailRenovation[] = [
  // ── PLANCHERS ──────────────────────────────────────────────────────────────

  {
    id: "ren_anj_plancher_haut",
    immeubleId: "imm_duplex_anjou",
    logementId: "log_anj_haut",
    titre: "Remplacement des planchers — 8452 (haut)",
    description:
      "Remplacement complet des planchers dans tous les espaces de vie. " +
      "Enlèvement des vieux revêtements, nivellement au besoin, installation de vinyle de luxe (LVP) ou bois franc engineered.",
    categorie: "PLANCHERS",
    statut: "PLANIFIE",
    priorite: 2,
    coutMin: 7000,
    coutMax: 14000,
    notes:
      "Surface estimée ~1 000 pi². LVP: ~7-10$/pi² posé. Bois franc: ~12-15$/pi² posé. " +
      "Consulter 2-3 entrepreneurs. Vérifier l'état du sous-plancher.",
  },
  {
    id: "ren_anj_plancher_bas",
    immeubleId: "imm_duplex_anjou",
    logementId: "log_anj_bas",
    titre: "Remplacement des planchers — 8450 (bas, proprio)",
    description:
      "Idem unité du haut. Vinyle de luxe dans cuisine/SDB, bois franc ou LVP dans les pièces à vivre.",
    categorie: "PLANCHERS",
    statut: "PLANIFIE",
    priorite: 2,
    coutMin: 6000,
    coutMax: 12000,
    notes: "Surface estimée ~950 pi². Prioriser la durabilité pour usage proprio.",
  },

  // ── SALLES DE BAIN ─────────────────────────────────────────────────────────

  {
    id: "ren_anj_sdb_haut_1",
    immeubleId: "imm_duplex_anjou",
    logementId: "log_anj_haut",
    titre: "Rénovation salle de bain principale — 8452",
    description:
      "Rénovation complète : bain/douche, robinetterie, vanité, miroir, plancher céramique, murs céramique, ventilation.",
    categorie: "SALLE_DE_BAIN",
    statut: "PLANIFIE",
    priorite: 2,
    coutMin: 9000,
    coutMax: 16000,
    notes: "1ère SDB — espace plus grand (4 chambres). Prévoir douche walk-in pour attirer locataires premium.",
  },
  {
    id: "ren_anj_sdb_haut_2",
    immeubleId: "imm_duplex_anjou",
    logementId: "log_anj_haut",
    titre: "Rénovation 2e salle de bain — 8452",
    description:
      "Rénovation de la 2e SDB : vanité, robinetterie, plancher, murs. Espace plus compact.",
    categorie: "SALLE_DE_BAIN",
    statut: "PLANIFIE",
    priorite: 3,
    coutMin: 6000,
    coutMax: 10000,
    notes: "Peut être simplifié si budget serré. Prioriser fonctionnalité.",
  },
  {
    id: "ren_anj_sdb_bas",
    immeubleId: "imm_duplex_anjou",
    logementId: "log_anj_bas",
    titre: "Rénovation salle de bain — 8450 (proprio)",
    description:
      "Rénovation complète selon les goûts du propriétaire. Budget plus flexible, finitions haut de gamme possibles.",
    categorie: "SALLE_DE_BAIN",
    statut: "PLANIFIE",
    priorite: 2,
    coutMin: 10000,
    coutMax: 20000,
    notes: "Usage personnel — investir dans la qualité et le confort.",
  },

  // ── CUISINES ───────────────────────────────────────────────────────────────

  {
    id: "ren_anj_cuisine_haut",
    immeubleId: "imm_duplex_anjou",
    logementId: "log_anj_haut",
    titre: "Rénovation cuisine — 8452 (haut)",
    description:
      "Réfection complète : armoires (IKEA ou semi-custom), comptoir quartz ou stratifié, dosseret, robinetterie, évier, luminaires. " +
      "Garder les appareils électroménagers si encore fonctionnels.",
    categorie: "CUISINE",
    statut: "PLANIFIE",
    priorite: 2,
    coutMin: 15000,
    coutMax: 28000,
    notes:
      "Armoires IKEA semi-custom + pose: ~$12-18k. Comptoir quartz: ~$3-5k. " +
      "Dosseret: ~$1-2k. Plomberie/électricité cuisine: ~$2-3k supplémentaire. " +
      "Cette rénovation est clé pour justifier le loyer de 2 750$/mois.",
  },
  {
    id: "ren_anj_cuisine_bas",
    immeubleId: "imm_duplex_anjou",
    logementId: "log_anj_bas",
    titre: "Rénovation cuisine — 8450 (proprio)",
    description:
      "Cuisine complète selon les préférences du propriétaire. Armoires custom ou semi-custom, comptoir haut de gamme.",
    categorie: "CUISINE",
    statut: "PLANIFIE",
    priorite: 2,
    coutMin: 18000,
    coutMax: 35000,
    notes: "Usage personnel — investir dans la configuration et les finitions souhaitées.",
  },

  // ── ÉLECTRICITÉ ────────────────────────────────────────────────────────────

  {
    id: "ren_anj_mise_terre",
    immeubleId: "imm_duplex_anjou",
    logementId: null,
    titre: "Mise à la terre du système électrique (grounding)",
    description:
      "Grounding complet du panel principal et des circuits. Maison construite en 1960 — mise à la terre probablement absente ou insuffisante. " +
      "Obligatoire pour sécurité et assurabilité.",
    categorie: "ELECTRICITE",
    statut: "PLANIFIE",
    priorite: 1,
    coutMin: 2500,
    coutMax: 5000,
    notes:
      "À faire EN PRIORITÉ avant les autres rénovations. " +
      "Appeler un maître électricien certifié (CMEQ). Obtenir permis Régie du bâtiment. " +
      "Vérifier aussi l'ampérage et l'état du panel (possiblement à 100A — idéalement upgrader à 200A).",
  },
  {
    id: "ren_anj_sortie_seche_haut",
    immeubleId: "imm_duplex_anjou",
    logementId: "log_anj_haut",
    titre: "Installation sortie sécheuse — 8452",
    description:
      "Ajout d'une prise 240V NEMA 14-30 pour sécheuse électrique. Conduit d'évacuation si sécheuse à tambour.",
    categorie: "ELECTRICITE",
    statut: "PLANIFIE",
    priorite: 2,
    coutMin: 400,
    coutMax: 900,
    notes: "À inclure dans le mandat de l'électricien pour la mise à terre — économie sur déplacement.",
  },
  {
    id: "ren_anj_sortie_seche_bas",
    immeubleId: "imm_duplex_anjou",
    logementId: "log_anj_bas",
    titre: "Installation sortie sécheuse — 8450",
    description:
      "Idem unité du bas. Prise 240V NEMA 14-30 pour sécheuse.",
    categorie: "ELECTRICITE",
    statut: "PLANIFIE",
    priorite: 2,
    coutMin: 400,
    coutMax: 900,
    notes: "Jumeler avec la mise à terre pour optimiser la visite de l'électricien.",
  },

  // ── CHAUFFAGE ──────────────────────────────────────────────────────────────

  {
    id: "ren_anj_chauffage_mazout",
    immeubleId: "imm_duplex_anjou",
    logementId: null,
    titre: "Conversion chauffage mazout → thermopompe bi-zone",
    description:
      "Remplacement du système de chauffage au mazout par une thermopompe centrale bi-zone (une par logement) ou une thermopompe bi-énergie avec appoint électrique. " +
      "Élimination du réservoir de mazout (enterré ou hors-sol). " +
      "Conversion vers chauffage 100% électrique ou bi-énergie pour réduire les coûts et l'impact environnemental. " +
      "Plusieurs subventions disponibles — voir détails.",
    categorie: "CHAUFFAGE",
    statut: "PLANIFIE",
    priorite: 1,
    coutMin: 15000,
    coutMax: 28000,
    notes:
      "Obtenir 3 soumissions. Préférer thermopompe ENERGY STAR certifiée pour maximiser les subventions. " +
      "Option recommandée : 2× thermopompes mini-split (une par logement) + appoint électrique pour les jours très froids. " +
      "Ne pas oublier de déclasser le réservoir mazout — prévoir ~1 000-2 500$ supplémentaire.",
    subventionsDisponibles: SUBVENTIONS_MAZOUT,
  },
  {
    id: "ren_anj_reservoir_mazout",
    immeubleId: "imm_duplex_anjou",
    logementId: null,
    titre: "Déclassement et retrait réservoir à mazout",
    description:
      "Vidange, nettoyage, déclassement réglementaire et retrait du réservoir à mazout (hors-sol ou enterré). " +
      "Si enterré : évaluation contamination sol possible.",
    categorie: "CHAUFFAGE",
    statut: "PLANIFIE",
    priorite: 1,
    coutMin: 800,
    coutMax: 3500,
    notes:
      "Réservoir hors-sol: ~$800-1500. Enterré: ~$2000-3500 + analyse sol possible. " +
      "Doit être réalisé par un entrepreneur certifié selon règlements MDDELCC.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getBudgetTotal(travaux: TravailRenovation[]) {
  const coutMinTotal = travaux.reduce((s, t) => s + t.coutMin, 0);
  const coutMaxTotal = travaux.reduce((s, t) => s + t.coutMax, 0);
  const subventionsTotales = travaux
    .flatMap(t => t.subventionsDisponibles ?? [])
    .filter(s => s.eligible)
    .reduce((s, sub) => s + (sub.montantEstime ?? 0), 0);

  return {
    min: coutMinTotal,
    max: coutMaxTotal,
    median: Math.round((coutMinTotal + coutMaxTotal) / 2),
    subventions: subventionsTotales,
    apresSubventions: Math.round((coutMinTotal + coutMaxTotal) / 2) - subventionsTotales,
  };
}

export function getTravauxParCategorie(travaux: TravailRenovation[]) {
  const cats = [...new Set(travaux.map(t => t.categorie))];
  return cats.map(cat => ({
    categorie: cat,
    travaux: travaux.filter(t => t.categorie === cat),
    budgetMin: travaux.filter(t => t.categorie === cat).reduce((s, t) => s + t.coutMin, 0),
    budgetMax: travaux.filter(t => t.categorie === cat).reduce((s, t) => s + t.coutMax, 0),
  }));
}
