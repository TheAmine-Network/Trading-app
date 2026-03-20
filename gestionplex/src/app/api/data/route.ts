/**
 * Route qui retourne les données fusionnées : mock-data + overrides du store persistant
 */
import { NextResponse } from "next/server";
import {
  immeubles,
  logements as baseLogements,
  locataires as baseLocataires,
  transactions as baseTransactions,
  demandesEntretien as baseDemandes,
  rappels as baseRappels,
} from "@/lib/mock-data";
import { readStore } from "@/lib/store";

export async function GET() {
  const store = readStore();

  // Appliquer les overrides sur les logements
  const logements = baseLogements.map(l => ({
    ...l,
    ...(store.logements[l.id] ?? {}),
  }));

  // Appliquer les overrides sur les locataires
  const locataires = baseLocataires.map(l => ({
    ...l,
    ...(store.locataires[l.id] ?? {}),
  }));

  // Fusionner les transactions
  const transactions = [...baseTransactions, ...store.transactions];

  // Fusionner les demandes d'entretien
  const demandesEntretien = [...baseDemandes, ...store.demandesEntretien];

  // Fusionner les rappels
  const rappels = [...baseRappels, ...store.rappels];

  return NextResponse.json({
    immeubles,
    logements,
    locataires,
    transactions,
    demandesEntretien,
    rappels,
  });
}
