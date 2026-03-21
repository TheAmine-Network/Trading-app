// Constantes de l'application GestionPlex

export const APP_NOM = "GestionPlex";
export const APP_PROPRIETAIRE = "Amine";

// ─── Types de transactions ──────────────────────────────────────────────────

export const TYPE_TRANSACTION_LABELS: Record<string, string> = {
  REVENU:                  "Revenu",
  DEPENSE:                 "Dépense exploit.", // legacy
  DEPENSE_EXPLOITATION:    "Dépense exploit.",
  DEPENSE_CAPITAL:         "Dépense capital",
  REMBOURSEMENT_HYPOTHEQUE:"Remb. hypothèque",
  ACQUISITION:             "Acquisition",
  TRANSFERT:               "Transfert",
  DEPOT_CAUTION:           "Dépôt de garantie",
};

// couleur CSS var pour chaque type
export const TYPE_TRANSACTION_COLOR: Record<string, string> = {
  REVENU:                   "var(--success)",
  DEPENSE:                  "var(--danger)",
  DEPENSE_EXPLOITATION:     "var(--danger)",
  DEPENSE_CAPITAL:          "var(--warning)",
  REMBOURSEMENT_HYPOTHEQUE: "var(--accent)",
  ACQUISITION:              "var(--info)",
  TRANSFERT:                "var(--fg-muted)",
  DEPOT_CAUTION:            "var(--purple)",
};

export const TYPE_TRANSACTION_BG: Record<string, string> = {
  REVENU:                   "var(--success-muted)",
  DEPENSE:                  "var(--danger-muted)",
  DEPENSE_EXPLOITATION:     "var(--danger-muted)",
  DEPENSE_CAPITAL:          "var(--warning-muted)",
  REMBOURSEMENT_HYPOTHEQUE: "var(--accent-muted)",
  ACQUISITION:              "var(--info-muted)",
  TRANSFERT:                "var(--bg-tertiary)",
  DEPOT_CAUTION:            "var(--purple-muted)",
};

export const TYPE_TRANSACTION_ICONE: Record<string, string> = {
  REVENU:                   "💰",
  DEPENSE:                  "💸",
  DEPENSE_EXPLOITATION:     "💸",
  DEPENSE_CAPITAL:          "🏗️",
  REMBOURSEMENT_HYPOTHEQUE: "🏦",
  ACQUISITION:              "🔑",
  TRANSFERT:                "↔️",
  DEPOT_CAUTION:            "🔒",
};

// ─── Catégories ─────────────────────────────────────────────────────────────

export const CATEGORIES_TRANSACTION_LABELS: Record<string, string> = {
  // Revenus
  LOYER:                 "Loyer",
  STATIONNEMENT:         "Stationnement",
  BUANDERIE:             "Buanderie",
  RANGEMENT:             "Rangement",
  FRAIS_ANIMAUX:         "Frais animaux",
  AUTRE_REVENU:          "Autre revenu",
  // Dépenses exploitation
  REPARATION:            "Réparation",
  ENTRETIEN:             "Entretien",
  DENEIGEMENT:           "Déneigement",
  NETTOYAGE:             "Nettoyage",
  ASSURANCE:             "Assurance",
  TAXES_MUNICIPALES:     "Taxes municipales",
  TAXES_SCOLAIRES:       "Taxes scolaires",
  ELECTRICITE:           "Électricité",
  GAZ:                   "Gaz",
  EAU:                   "Eau / égout",
  GESTION:               "Gestion imm.",
  COMPTABILITE:          "Comptabilité / légal",
  PUBLICITE:             "Publicité / annonces",
  INTERETS_HYPOTHECAIRES:"Intérêts hypothécaires",
  FRAIS_BANCAIRES:       "Frais bancaires",
  AUTRE_DEPENSE:         "Autre dépense",
  // Dépenses capital
  TOITURE:               "Toiture",
  HVAC:                  "HVAC / chauffage",
  FENETRES:              "Fenêtres / portes",
  CUISINE_SDB:           "Cuisine / salle de bain",
  FONDATION:             "Fondation / structure",
  ELECTRICITE_MAJEURE:   "Électricité (majeure)",
  PLOMBERIE_MAJEURE:     "Plomberie (majeure)",
  APPAREILS:             "Appareils électroménagers",
  AUTRE_CAPITAL:         "Autre immobilisation",
  // Legacy
  HYPOTHEQUE:            "Hypothèque (legacy)",
  RENOVATION:            "Rénovation",
  AUTRE:                 "Autre",
};

// Catégories disponibles par type de transaction
export const CATEGORIES_PAR_TYPE: Record<string, string[]> = {
  REVENU: [
    "LOYER", "STATIONNEMENT", "BUANDERIE", "RANGEMENT",
    "FRAIS_ANIMAUX", "AUTRE_REVENU",
  ],
  DEPENSE: [
    "REPARATION", "ENTRETIEN", "DENEIGEMENT", "NETTOYAGE",
    "ASSURANCE", "TAXES_MUNICIPALES", "TAXES_SCOLAIRES",
    "ELECTRICITE", "GAZ", "EAU", "GESTION", "COMPTABILITE",
    "PUBLICITE", "INTERETS_HYPOTHECAIRES", "FRAIS_BANCAIRES", "AUTRE_DEPENSE",
  ],
  DEPENSE_EXPLOITATION: [
    "REPARATION", "ENTRETIEN", "DENEIGEMENT", "NETTOYAGE",
    "ASSURANCE", "TAXES_MUNICIPALES", "TAXES_SCOLAIRES",
    "ELECTRICITE", "GAZ", "EAU", "GESTION", "COMPTABILITE",
    "PUBLICITE", "INTERETS_HYPOTHECAIRES", "FRAIS_BANCAIRES", "AUTRE_DEPENSE",
  ],
  DEPENSE_CAPITAL: [
    "TOITURE", "HVAC", "FENETRES", "CUISINE_SDB", "FONDATION",
    "ELECTRICITE_MAJEURE", "PLOMBERIE_MAJEURE", "APPAREILS", "AUTRE_CAPITAL",
  ],
  REMBOURSEMENT_HYPOTHEQUE: ["HYPOTHEQUE"],
  ACQUISITION:   ["AUTRE"],
  TRANSFERT:     ["AUTRE"],
  DEPOT_CAUTION: ["AUTRE"],
};

// Icône par catégorie
export const ICONE_CATEGORIE: Record<string, string> = {
  // Revenus
  LOYER:                  "🏠",
  STATIONNEMENT:          "🚗",
  BUANDERIE:              "🧺",
  RANGEMENT:              "📦",
  FRAIS_ANIMAUX:          "🐾",
  AUTRE_REVENU:           "💰",
  // Exploitation
  REPARATION:             "🔧",
  ENTRETIEN:              "🔨",
  DENEIGEMENT:            "❄️",
  NETTOYAGE:              "🧹",
  ASSURANCE:              "🛡️",
  TAXES_MUNICIPALES:      "🏛️",
  TAXES_SCOLAIRES:        "🏫",
  ELECTRICITE:            "⚡",
  GAZ:                    "🔥",
  EAU:                    "💧",
  GESTION:                "📊",
  COMPTABILITE:           "📒",
  PUBLICITE:              "📢",
  INTERETS_HYPOTHECAIRES: "🏦",
  FRAIS_BANCAIRES:        "🏧",
  AUTRE_DEPENSE:          "💸",
  // Capital
  TOITURE:                "🏠",
  HVAC:                   "♨️",
  FENETRES:               "🪟",
  CUISINE_SDB:            "🍳",
  FONDATION:              "🧱",
  ELECTRICITE_MAJEURE:    "⚡",
  PLOMBERIE_MAJEURE:      "🚿",
  APPAREILS:              "🫙",
  AUTRE_CAPITAL:          "🏗️",
  // Legacy
  HYPOTHEQUE:             "🏦",
  RENOVATION:             "🏗️",
  AUTRE:                  "📋",
};

// ─── Autres constantes ───────────────────────────────────────────────────────

export const CATEGORIE_ENTRETIEN_LABELS: Record<string, string> = {
  PLOMBERIE:  "Plomberie",
  ELECTRICITE:"Électricité",
  CHAUFFAGE:  "Chauffage",
  STRUCTURE:  "Structure",
  APPAREILS:  "Appareils",
  PEINTURE:   "Peinture",
  EXTERIEUR:  "Extérieur",
  AUTRE:      "Autre",
};

export const STATUT_LOGEMENT_LABELS: Record<string, string> = {
  OCCUPE:        "Occupé",
  VACANT:        "Vacant",
  EN_RENOVATION: "En rénovation",
};

export const STATUT_LOGEMENT_COLORS: Record<string, string> = {
  OCCUPE:        "success",
  VACANT:        "warning",
  EN_RENOVATION: "info",
};

export const PRIORITE_LABELS: Record<string, string> = {
  URGENTE: "Urgente",
  HAUTE:   "Haute",
  NORMALE: "Normale",
  BASSE:   "Basse",
};

export const PRIORITE_COLORS: Record<string, string> = {
  URGENTE: "danger",
  HAUTE:   "warning",
  NORMALE: "info",
  BASSE:   "muted",
};

export const STATUT_ENTRETIEN_LABELS: Record<string, string> = {
  NOUVELLE:          "Nouvelle",
  EN_COURS:          "En cours",
  EN_ATTENTE_PIECE:  "En attente de pièce",
  TERMINEE:          "Terminée",
  ANNULEE:           "Annulée",
};

export const METHODE_PAIEMENT_LABELS: Record<string, string> = {
  VIREMENT:    "Virement",
  CHEQUE:      "Chèque",
  COMPTANT:    "Comptant",
  PRELEVEMENT: "Prélèvement automatique",
};

// Taux TAL — Augmentation maximale suggérée
export const TAL_TAUX_AUGMENTATION_SUGGERE = 0.9; // 0.9% pour 2024

export const MOIS_NOMS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

// ─── Helpers calculs financiers ──────────────────────────────────────────────

/** Types qui constituent des charges d'exploitation (impact P&L) */
export function isDepenseExploitation(type: string, categorie?: string): boolean {
  if (type === "DEPENSE" && categorie === "HYPOTHEQUE") return false; // legacy — dette
  if (type === "DEPENSE" || type === "DEPENSE_EXPLOITATION") return true;
  if (type === "REMBOURSEMENT_HYPOTHEQUE") return false; // géré séparément
  return false;
}

/** La portion intérêts d'un remboursement hypothécaire est une charge d'exploitation */
export function isServiceDette(type: string, categorie?: string): boolean {
  if (type === "REMBOURSEMENT_HYPOTHEQUE") return true;
  if (type === "DEPENSE" && categorie === "HYPOTHEQUE") return true;
  return false;
}

/** CapEx — immobilisations amortissables */
export function isDepenseCapital(type: string): boolean {
  return type === "DEPENSE_CAPITAL";
}
