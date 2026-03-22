// Types globaux GestionPlex

export type TypeImmeuble = "TRIPLEX" | "DUPLEX" | "QUADRUPLEX" | "IMMEUBLE" | "MAISON" | "CONDO";
export type StatutLogement = "OCCUPE" | "VACANT" | "EN_RENOVATION";
export type StatutLocataire = "ACTIF" | "ANCIEN" | "EN_ATTENTE";
export type StatutBail = "ACTIF" | "EXPIRE" | "EN_RENOUVELLEMENT";
export type TypeTransaction =
  | "REVENU"
  | "DEPENSE"                   // legacy — traité comme DEPENSE_EXPLOITATION
  | "DEPENSE_EXPLOITATION"      // charge opérationnelle (P&L)
  | "DEPENSE_CAPITAL"           // immobilisation amortissable (bilan)
  | "REMBOURSEMENT_HYPOTHEQUE"  // scindé : intérêts (charge) + capital (passif)
  | "ACQUISITION"               // achat de propriété (écriture au bilan)
  | "TRANSFERT"                 // virement inter-comptes
  | "DEPOT_CAUTION";            // dépôt de garantie locataire (passif)

export type CategorieTransaction =
  // Revenus
  | "LOYER"
  | "STATIONNEMENT"
  | "BUANDERIE"
  | "RANGEMENT"
  | "FRAIS_ANIMAUX"
  | "AUTRE_REVENU"
  // Dépenses exploitation
  | "REPARATION"
  | "ENTRETIEN"
  | "DENEIGEMENT"
  | "NETTOYAGE"
  | "ASSURANCE"
  | "TAXES_MUNICIPALES"
  | "TAXES_SCOLAIRES"
  | "ELECTRICITE"
  | "GAZ"
  | "EAU"
  | "GESTION"
  | "COMPTABILITE"
  | "PUBLICITE"
  | "INTERETS_HYPOTHECAIRES"
  | "FRAIS_BANCAIRES"
  | "AUTRE_DEPENSE"
  // Dépenses capital
  | "TOITURE"
  | "HVAC"
  | "FENETRES"
  | "CUISINE_SDB"
  | "FONDATION"
  | "ELECTRICITE_MAJEURE"
  | "PLOMBERIE_MAJEURE"
  | "APPAREILS"
  | "AUTRE_CAPITAL"
  // Legacy (compatibilité données mock)
  | "HYPOTHEQUE"
  | "RENOVATION"
  | "AUTRE";
export type MethodePaiement = "VIREMENT" | "CHEQUE" | "COMPTANT" | "PRELEVEMENT";
export type PrioriteEntretien = "URGENTE" | "HAUTE" | "NORMALE" | "BASSE";
export type StatutEntretien =
  | "NOUVELLE"
  | "EN_COURS"
  | "EN_ATTENTE_PIECE"
  | "TERMINEE"
  | "ANNULEE";
export type CategorieEntretien =
  | "PLOMBERIE"
  | "ELECTRICITE"
  | "CHAUFFAGE"
  | "STRUCTURE"
  | "APPAREILS"
  | "PEINTURE"
  | "EXTERIEUR"
  | "AUTRE";
export type TypeDocument =
  | "BAIL"
  | "ASSURANCE"
  | "TAXE"
  | "FACTURE"
  | "PHOTO"
  | "INSPECTION"
  | "AUTRE";
export type StatutRappel = "ACTIF" | "COMPLETE" | "REPORTE";
export type FrequenceRappel = "QUOTIDIEN" | "HEBDOMADAIRE" | "MENSUEL" | "ANNUEL";

export interface Immeuble {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  province: string;
  codePostal: string;
  type: TypeImmeuble;
  anneeConstruct?: number;
  nbLogements: number;
  photoUrl?: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
  dateAchat?: Date;
  prixAchat?: number;
  valeurMunicipale?: number;
  numeroLot?: string;
  createdAt: Date;
  updatedAt: Date;
  logements?: Logement[];
  transactions?: Transaction[];
}

export interface Logement {
  id: string;
  immeubleId: string;
  numero: string;
  superficie?: number;
  nbChambres: number;
  nbSallesBain: number;
  statut: StatutLogement;
  loyerMensuel: number;
  inclChauffage: boolean;
  inclEauChaude: boolean;
  inclElectricite: boolean;
  inclStationnement: boolean;
  inclRangement: boolean;
  photos: string[];
  notes?: string;
  /** Unité occupée par le propriétaire — pas de loyer perçu */
  proprietaireOccupant?: boolean;
  createdAt: Date;
  updatedAt: Date;
  immeuble?: Immeuble;
  locataires?: Locataire[];
  baux?: Bail[];
}

export interface Locataire {
  id: string;
  logementId?: string;
  prenom: string;
  nom: string;
  email?: string;
  telephone?: string;
  telephoneUrgence?: string;
  dateNaissance?: Date;
  statut: StatutLocataire;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  logement?: Logement;
  baux?: Bail[];
}

export interface Bail {
  id: string;
  logementId: string;
  locataireId: string;
  dateDebut: Date;
  dateFin: Date;
  loyerMensuel: number;
  depot?: number;
  clausesSpeciales?: string;
  documentUrl?: string;
  statut: StatutBail;
  augmentationAnnuelle?: number;
  sectionG: boolean;
  createdAt: Date;
  updatedAt: Date;
  logement?: Logement;
  locataire?: Locataire;
}

export interface Transaction {
  id: string;
  immeubleId: string;
  logementId?: string;
  type: TypeTransaction;
  categorie: CategorieTransaction;
  montant: number;
  date: Date;
  description: string;
  recuUrl?: string;
  fournisseur?: string;
  methodePaiement?: MethodePaiement;
  recurrent: boolean;
  recurrenceJour?: number;
  notes?: string;
  // Scission hypothèque (REMBOURSEMENT_HYPOTHEQUE)
  portionInteret?: number;
  portionCapital?: number;
  // Dépense capital (DEPENSE_CAPITAL)
  dateMiseEnService?: string;
  dureeUtileAns?: number;
  // Acquisition (ACQUISITION)
  miseDesFonds?: number;
  montantHypotheque?: number;
  fraisClosing?: number;
  createdAt: Date;
  updatedAt: Date;
  immeuble?: Immeuble;
  logement?: Logement;
}

export interface DemandeEntretien {
  id: string;
  logementId: string;
  locataireId?: string;
  titre: string;
  description: string;
  priorite: PrioriteEntretien;
  statut: StatutEntretien;
  categorie: CategorieEntretien;
  photos: string[];
  dateOuverture: Date;
  dateFermeture?: Date;
  cout?: number;
  fournisseurAssigne?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  logement?: Logement;
  locataire?: Locataire;
}

export interface Document {
  id: string;
  immeubleId?: string;
  logementId?: string;
  nom: string;
  type: TypeDocument;
  fichierUrl: string;
  tailleFichier?: number;
  mimeType?: string;
  tags: string[];
  createdAt: Date;
}

export interface Rappel {
  id: string;
  titre: string;
  description?: string;
  date: Date;
  recurrent: boolean;
  frequence?: FrequenceRappel;
  immeubleId?: string;
  logementId?: string;
  bailId?: string;
  statut: StatutRappel;
  createdAt: Date;
}

// Types pour le dashboard
export interface StatsDashboard {
  revenusTotal: number;
  depensesTotal: number;
  profitNet: number;
  nbLogementsOccupes: number;
  nbLogementsTotal: number;
  tauxOccupation: number;
  revenusParMois: { mois: string; revenus: number; depenses: number }[];
}
