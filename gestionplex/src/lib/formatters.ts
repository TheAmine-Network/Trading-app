// Formatage monnaie CAD et dates pour le Québec

/**
 * Formate un montant en dollars canadiens (CAD)
 */
export function formatCAD(montant: number | string): string {
  const valeur = typeof montant === "string" ? parseFloat(montant) : montant;
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valeur);
}

/**
 * Formate un montant compact (ex: 12,3 k$)
 */
export function formatCADCompact(montant: number): string {
  if (Math.abs(montant) >= 1000) {
    return new Intl.NumberFormat("fr-CA", {
      style: "currency",
      currency: "CAD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(montant);
  }
  return formatCAD(montant);
}

/**
 * Formate une date en français québécois
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Formate une date courte
 */
export function formatDateCourt(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Formate une date relative (il y a X jours, dans X jours)
 */
export function formatDateRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const maintenant = new Date();
  const diffMs = d.getTime() - maintenant.getTime();
  const diffJours = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffJours === 0) return "Aujourd'hui";
  if (diffJours === 1) return "Demain";
  if (diffJours === -1) return "Hier";
  if (diffJours > 0) return `Dans ${diffJours} jours`;
  return `Il y a ${Math.abs(diffJours)} jours`;
}

/**
 * Retourne le nom du mois en français
 */
export function nomMois(mois: number): string {
  const moisFr = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];
  return moisFr[mois] || "";
}

/**
 * Formate un pourcentage
 */
export function formatPourcentage(valeur: number, decimales = 1): string {
  return `${valeur.toFixed(decimales)} %`;
}

/**
 * Formate une superficie en pieds carrés
 */
export function formatSuperficie(pieds: number): string {
  return `${pieds.toLocaleString("fr-CA")} pi²`;
}
