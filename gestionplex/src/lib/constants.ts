// Constantes de l'application GestionPlex

export const APP_NOM = "GestionPlex";
export const APP_PROPRIETAIRE = "Amine";

export const CATEGORIES_TRANSACTION_LABELS: Record<string, string> = {
  LOYER: "Loyer",
  STATIONNEMENT: "Stationnement",
  BUANDERIE: "Buanderie",
  REPARATION: "Réparation",
  ASSURANCE: "Assurance",
  TAXES_MUNICIPALES: "Taxes municipales",
  TAXES_SCOLAIRES: "Taxes scolaires",
  HYPOTHEQUE: "Hypothèque",
  DENEIGEMENT: "Déneigement",
  ENTRETIEN: "Entretien",
  RENOVATION: "Rénovation",
  ELECTRICITE: "Électricité",
  GAZ: "Gaz",
  AUTRE: "Autre",
};

export const CATEGORIE_ENTRETIEN_LABELS: Record<string, string> = {
  PLOMBERIE: "Plomberie",
  ELECTRICITE: "Électricité",
  CHAUFFAGE: "Chauffage",
  STRUCTURE: "Structure",
  APPAREILS: "Appareils",
  PEINTURE: "Peinture",
  EXTERIEUR: "Extérieur",
  AUTRE: "Autre",
};

export const STATUT_LOGEMENT_LABELS: Record<string, string> = {
  OCCUPE: "Occupé",
  VACANT: "Vacant",
  EN_RENOVATION: "En rénovation",
};

export const STATUT_LOGEMENT_COLORS: Record<string, string> = {
  OCCUPE: "success",
  VACANT: "warning",
  EN_RENOVATION: "info",
};

export const PRIORITE_LABELS: Record<string, string> = {
  URGENTE: "Urgente",
  HAUTE: "Haute",
  NORMALE: "Normale",
  BASSE: "Basse",
};

export const PRIORITE_COLORS: Record<string, string> = {
  URGENTE: "danger",
  HAUTE: "warning",
  NORMALE: "info",
  BASSE: "muted",
};

export const STATUT_ENTRETIEN_LABELS: Record<string, string> = {
  NOUVELLE: "Nouvelle",
  EN_COURS: "En cours",
  EN_ATTENTE_PIECE: "En attente de pièce",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export const METHODE_PAIEMENT_LABELS: Record<string, string> = {
  VIREMENT: "Virement",
  CHEQUE: "Chèque",
  COMPTANT: "Comptant",
  PRELEVEMENT: "Prélèvement automatique",
};

// Taux TAL — Augmentation maximale suggérée (approximatif, à ajuster annuellement)
export const TAL_TAUX_AUGMENTATION_SUGGERE = 0.9; // 0.9% pour 2024

export const MOIS_NOMS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];
