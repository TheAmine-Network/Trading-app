"use client";

import { useEffect, useState } from "react";
import type { Immeuble, Logement, Locataire, Transaction, DemandeEntretien, Rappel } from "@/types";
import {
  immeubles as mockImmeubles,
  logements as mockLogements,
  locataires as mockLocataires,
  transactions as mockTransactions,
  demandesEntretien as mockDemandes,
  rappels as mockRappels,
} from "@/lib/mock-data";

export interface AppData {
  immeubles: Immeuble[];
  logements: Logement[];
  locataires: Locataire[];
  transactions: Transaction[];
  demandesEntretien: DemandeEntretien[];
  rappels: Rappel[];
}

const defaultData: AppData = {
  immeubles: mockImmeubles,
  logements: mockLogements,
  locataires: mockLocataires,
  transactions: mockTransactions,
  demandesEntretien: mockDemandes,
  rappels: mockRappels,
};

export function useData(): AppData & { refresh: () => void } {
  const [data, setData] = useState<AppData>(defaultData);

  const load = () => {
    fetch("/api/data")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setData(defaultData));
  };

  useEffect(() => {
    load();
  }, []);

  return { ...data, refresh: load };
}
