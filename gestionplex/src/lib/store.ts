/**
 * Store persistant — overrides sur les données mock
 * Écrit dans /tmp/gestionplex-store.json pour persister entre les requêtes
 */
import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "gestionplex-store.json");

export interface StoreData {
  logements: Record<string, Partial<{ loyerMensuel: number; statut: string; notes: string }>>;
  locataires: Record<string, Partial<{ email: string; telephone: string; notes: string }>>;
  demandesOverrides: Record<string, Partial<{ statut: string; notes: string; cout: number; fournisseurAssigne: string; dateFermeture: string }>>;
  transactions: Array<{
    id: string;
    immeubleId: string;
    logementId?: string;
    type: string;
    categorie: string;
    montant: number;
    date: string;
    description: string;
    methodePaiement?: string;
    fournisseur?: string;
    notes?: string;
  }>;
  demandesEntretien: Array<{
    id: string;
    logementId: string;
    titre: string;
    description: string;
    priorite: string;
    statut: string;
    categorie: string;
    notes?: string;
  }>;
  rappels: Array<{
    id: string;
    titre: string;
    description: string;
    date: string;
    immeubleId?: string;
    statut: string;
  }>;
}

const DEFAULT_STORE: StoreData = {
  logements: {},
  locataires: {},
  demandesOverrides: {},
  transactions: [],
  demandesEntretien: [],
  rappels: [],
};

export function readStore(): StoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_STORE, transactions: [], demandesEntretien: [], rappels: [] };
}

export function writeStore(data: StoreData): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function updateLogement(id: string, overrides: Partial<{ loyerMensuel: number; statut: string; notes: string }>) {
  const store = readStore();
  store.logements[id] = { ...store.logements[id], ...overrides };
  writeStore(store);
}

export function updateLocataire(id: string, overrides: Partial<{ email: string; telephone: string; notes: string }>) {
  const store = readStore();
  store.locataires[id] = { ...store.locataires[id], ...overrides };
  writeStore(store);
}

export function addTransaction(tx: StoreData["transactions"][0]) {
  const store = readStore();
  store.transactions.push(tx);
  writeStore(store);
}

export function addDemandeEntretien(d: StoreData["demandesEntretien"][0]) {
  const store = readStore();
  store.demandesEntretien.push(d);
  writeStore(store);
}

export function addRappel(r: StoreData["rappels"][0]) {
  const store = readStore();
  store.rappels.push(r);
  writeStore(store);
}

export function updateDemandeEntretien(id: string, overrides: Partial<{ statut: string; notes: string; cout: number; fournisseurAssigne: string; dateFermeture: string }>) {
  const store = readStore();
  if (!store.demandesOverrides) store.demandesOverrides = {};
  store.demandesOverrides[id] = { ...store.demandesOverrides[id], ...overrides };
  writeStore(store);
}
