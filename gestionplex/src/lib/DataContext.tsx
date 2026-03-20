"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import type { Immeuble, Logement, Locataire, Bail, Transaction, DemandeEntretien, Rappel } from "@/types";
import {
  immeubles as mockImmeubles,
  logements as mockLogements,
  locataires as mockLocataires,
  baux as mockBaux,
  transactions as mockTransactions,
  demandesEntretien as mockDemandes,
  rappels as mockRappels,
} from "@/lib/mock-data";

export interface AppData {
  immeubles: Immeuble[];
  logements: Logement[];
  locataires: Locataire[];
  baux: Bail[];
  transactions: Transaction[];
  demandesEntretien: DemandeEntretien[];
  rappels: Rappel[];
  refresh: () => void;
  getTauxOccupation: () => { nbOccupes: number; nbTotal: number; taux: number };
}

const defaultData: AppData = {
  immeubles: mockImmeubles,
  logements: mockLogements,
  locataires: mockLocataires,
  baux: mockBaux,
  transactions: mockTransactions,
  demandesEntretien: mockDemandes,
  rappels: mockRappels,
  refresh: () => {},
  getTauxOccupation: () => {
    const nbTotal = mockLogements.length;
    const nbOccupes = mockLogements.filter(l => l.statut === "OCCUPE").length;
    return { nbTotal, nbOccupes, taux: (nbOccupes / nbTotal) * 100 };
  },
};

const DataContext = createContext<AppData>(defaultData);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<AppData, "refresh" | "getTauxOccupation">>(defaultData);

  const load = useCallback(() => {
    fetch("/api/data")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {/* garde les données par défaut */});
  }, []);

  useEffect(() => { load(); }, [load]);

  const getTauxOccupation = useCallback(() => {
    const nbTotal = data.logements.length;
    const nbOccupes = data.logements.filter(l => l.statut === "OCCUPE").length;
    return { nbTotal, nbOccupes, taux: nbTotal > 0 ? (nbOccupes / nbTotal) * 100 : 0 };
  }, [data.logements]);

  return (
    <DataContext.Provider value={{ ...data, refresh: load, getTauxOccupation }}>
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  return useContext(DataContext);
}
