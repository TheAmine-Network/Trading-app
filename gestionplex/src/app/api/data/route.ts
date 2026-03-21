/**
 * Route qui retourne les données fusionnées : mock-data + overrides du store persistant
 */
import { NextResponse } from "next/server";
import {
  immeubles,
  logements as baseLogements,
  locataires as baseLocataires,
  baux,
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

  // Fusionner les transactions + appliquer les overrides
  const txOverrides = store.transactionsOverrides ?? {};
  const transactions = [...baseTransactions, ...store.transactions].map(t => ({
    ...t,
    ...(txOverrides[t.id] ?? {}),
  }));

  // Fusionner les demandes d'entretien + appliquer les overrides de statut
  const overrides = store.demandesOverrides ?? {};
  const demandesEntretien = [...baseDemandes, ...store.demandesEntretien].map(d => ({
    ...d,
    ...(overrides[d.id] ?? {}),
  }));

  // Fusionner les rappels
  const rappels = [...baseRappels, ...store.rappels];

  return NextResponse.json({
    immeubles,
    logements,
    locataires,
    baux,
    transactions,
    demandesEntretien,
    rappels,
  });
}
