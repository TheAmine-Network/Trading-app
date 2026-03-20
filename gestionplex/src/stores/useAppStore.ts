import { create } from "zustand";

interface AppState {
  // Filtres finances
  periodeFinances: "mois" | "trimestre" | "semestre" | "annee";
  setPeriodeFinances: (periode: AppState["periodeFinances"]) => void;

  // Filtres entretien
  filtreEntretienStatut: "ouvertes" | "terminees";
  setFiltreEntretienStatut: (statut: AppState["filtreEntretienStatut"]) => void;

  // Filtres locataires
  filtreLocataires: "tous" | "actifs" | "anciens";
  setFiltreLocataires: (filtre: AppState["filtreLocataires"]) => void;

  // Modal
  modalOuvert: boolean;
  setModalOuvert: (ouvert: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  periodeFinances: "mois",
  setPeriodeFinances: (periode) => set({ periodeFinances: periode }),

  filtreEntretienStatut: "ouvertes",
  setFiltreEntretienStatut: (statut) =>
    set({ filtreEntretienStatut: statut }),

  filtreLocataires: "tous",
  setFiltreLocataires: (filtre) => set({ filtreLocataires: filtre }),

  modalOuvert: false,
  setModalOuvert: (ouvert) => set({ modalOuvert: ouvert }),
}));
