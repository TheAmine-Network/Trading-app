// Données de démonstration pour GestionPlex
// Ces données simulent la base de données Supabase/Prisma

import type {
  Immeuble, Logement, Locataire, Bail, Transaction,
  DemandeEntretien, Rappel
} from "@/types";

// ─── IMMEUBLES ───────────────────────────────────────────────────────────────

export const immeubles: Immeuble[] = [
  {
    id: "imm_triplex_rosemont",
    nom: "Triplex Rosemont",
    adresse: "4823, rue Beaubien Est",
    ville: "Montréal",
    province: "QC",
    codePostal: "H1X 1H7",
    type: "TRIPLEX",
    anneeConstruct: 1952,
    nbLogements: 3,
    photoUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    dateAchat: new Date("2018-06-15"),
    prixAchat: 680000,
    valeurMunicipale: 742000,
    numeroLot: "1 476 234",
    notes: "Toit refait en 2020. Chauffe-eau changé en 2022.",
    createdAt: new Date("2018-06-15"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "imm_duplex_villeray",
    nom: "Duplex Villeray",
    adresse: "7241, rue Lajeunesse",
    ville: "Montréal",
    province: "QC",
    codePostal: "H2R 2H8",
    type: "DUPLEX",
    anneeConstruct: 1965,
    nbLogements: 2,
    photoUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    dateAchat: new Date("2021-03-22"),
    prixAchat: 520000,
    valeurMunicipale: 568000,
    numeroLot: "2 198 445",
    notes: "Rénovation de la cuisine du bas en cours.",
    createdAt: new Date("2021-03-22"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "imm_duplex_anjou",
    nom: "Duplex Anjou — Sublaines",
    adresse: "8450-8452, avenue Sublaines",
    ville: "Montréal (Anjou)",
    province: "QC",
    codePostal: "H1K 2B9",
    type: "DUPLEX",
    anneeConstruct: 1960,
    nbLogements: 2,
    photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    dateAchat: new Date("2026-03-20"),
    prixAchat: 829000,
    valeurMunicipale: 774000,
    numeroLot: "1112216",
    notes:
      "Duplex jumelé construit en 1960. Brique/vinyle, fondation béton coulé, garage chauffé intégré, allée asphaltée. " +
      "Certificat de localisation 2022. " +
      "Chauffage au mazout — conversion thermopompe planifiée. " +
      "Propriétaire occupe le bas (8450). Unité du haut (8452) à louer.",
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-03-20"),
  },
];

// ─── LOGEMENTS ───────────────────────────────────────────────────────────────

export const logements: Logement[] = [
  // Triplex Rosemont
  {
    id: "log_rose_rdc",
    immeubleId: "imm_triplex_rosemont",
    numero: "Rez-de-chaussée",
    superficie: 850,
    nbChambres: 2,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 1200,
    inclChauffage: true,
    inclEauChaude: true,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: true,
    photos: [],
    notes: "4½ rénové. Belle luminosité côté cour.",
    createdAt: new Date("2018-06-15"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "log_rose_1er",
    immeubleId: "imm_triplex_rosemont",
    numero: "1er étage",
    superficie: 1050,
    nbChambres: 3,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 1400,
    inclChauffage: true,
    inclEauChaude: true,
    inclElectricite: false,
    inclStationnement: true,
    inclRangement: true,
    photos: [],
    notes: "5½. Grand balcon avant.",
    createdAt: new Date("2018-06-15"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "log_rose_2e",
    immeubleId: "imm_triplex_rosemont",
    numero: "2e étage",
    superficie: 880,
    nbChambres: 2,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 1250,
    inclChauffage: true,
    inclEauChaude: true,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: false,
    photos: [],
    notes: "4½. Vue sur le parc Rosemont.",
    createdAt: new Date("2018-06-15"),
    updatedAt: new Date("2024-01-01"),
  },
  // Duplex Anjou — 8452 (haut, vacant, à louer)
  {
    id: "log_anj_haut",
    immeubleId: "imm_duplex_anjou",
    numero: "8452 — Haut",
    superficie: 1087, // 2174 pi² / 2 (estimation)
    nbChambres: 4,
    nbSallesBain: 2,
    statut: "EN_RENOVATION",
    loyerMensuel: 0, // Vacant — valeur locative cible 2 750$
    inclChauffage: true,
    inclEauChaude: false,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: false,
    proprietaireOccupant: false,
    photos: [],
    notes:
      "7 pièces, 4 chambres, 2 SDB, inst. lav/séch. Vacant. Valeur locative cible: 2 750 $/mois. " +
      "Rénovations en cours : planchers, SDB, cuisine, mise à terre élec, sortie sécheuse.",
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-03-20"),
  },
  // Duplex Anjou — 8450 (bas, propriétaire occupant)
  {
    id: "log_anj_bas",
    immeubleId: "imm_duplex_anjou",
    numero: "8450 — Bas (propriétaire)",
    superficie: 1087,
    nbChambres: 3,
    nbSallesBain: 1,
    statut: "EN_RENOVATION",
    loyerMensuel: 0, // Propriétaire occupant
    inclChauffage: true,
    inclEauChaude: false,
    inclElectricite: false,
    inclStationnement: true,
    inclRangement: false,
    proprietaireOccupant: true,
    photos: [],
    notes:
      "5 pièces, 3 chambres, 1 SDB, inst. lav/séch, garage chauffé intégré. " +
      "Habité par le propriétaire. Valeur locative: 2 250 $/mois. " +
      "Rénovations en cours : planchers, SDB, cuisine, mise à terre élec, sortie sécheuse.",
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-03-20"),
  },
  // Duplex Villeray
  {
    id: "log_vil_bas",
    immeubleId: "imm_duplex_villeray",
    numero: "Bas-duplex",
    superficie: 980,
    nbChambres: 3,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 1350,
    inclChauffage: true,
    inclEauChaude: true,
    inclElectricite: false,
    inclStationnement: true,
    inclRangement: false,
    photos: [],
    notes: "5½. Locataire stable depuis 3 ans.",
    createdAt: new Date("2021-03-22"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "log_vil_haut",
    immeubleId: "imm_duplex_villeray",
    numero: "Haut-duplex",
    superficie: 900,
    nbChambres: 2,
    nbSallesBain: 1,
    statut: "EN_RENOVATION",
    loyerMensuel: 1150,
    inclChauffage: true,
    inclEauChaude: true,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: false,
    photos: [],
    notes: "4½. Rénovation cuisine et salle de bain en cours. Disponible avril 2024.",
    createdAt: new Date("2021-03-22"),
    updatedAt: new Date("2024-02-01"),
  },
];

// ─── LOCATAIRES ──────────────────────────────────────────────────────────────

export const locataires: Locataire[] = [
  {
    id: "loc_001",
    logementId: "log_rose_rdc",
    prenom: "Marie-Claude",
    nom: "Tremblay",
    email: "mc.tremblay@gmail.com",
    telephone: "514-555-2341",
    telephoneUrgence: "514-555-8901",
    dateNaissance: new Date("1985-07-12"),
    statut: "ACTIF",
    notes: "Très bon payeur. Travaille comme infirmière.",
    createdAt: new Date("2020-07-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "loc_002",
    logementId: "log_rose_1er",
    prenom: "Jean-Philippe",
    nom: "Gagnon",
    email: "jp.gagnon@outlook.com",
    telephone: "438-555-7823",
    telephoneUrgence: "514-555-3344",
    dateNaissance: new Date("1990-03-25"),
    statut: "ACTIF",
    notes: "Famille avec 2 enfants. Toujours paye par virement.",
    createdAt: new Date("2019-09-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "loc_003",
    logementId: "log_rose_2e",
    prenom: "Fatima",
    nom: "Benali",
    email: "f.benali@hotmail.com",
    telephone: "514-555-6612",
    telephoneUrgence: "514-555-9901",
    dateNaissance: new Date("1993-11-08"),
    statut: "ACTIF",
    notes: "Étudiante à l'UQAM. Paiement automatique.",
    createdAt: new Date("2022-09-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "loc_004",
    logementId: "log_vil_bas",
    prenom: "Roberto",
    nom: "Esposito",
    email: "r.esposito@gmail.com",
    telephone: "514-555-4421",
    telephoneUrgence: "514-555-6677",
    dateNaissance: new Date("1978-05-30"),
    statut: "ACTIF",
    notes: "Mécanicien. Locataire depuis 2021. Très respectueux.",
    createdAt: new Date("2021-04-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// ─── BAUX ────────────────────────────────────────────────────────────────────

export const baux: Bail[] = [
  {
    id: "bail_001",
    logementId: "log_rose_rdc",
    locataireId: "loc_001",
    dateDebut: new Date("2023-07-01"),
    dateFin: new Date("2024-06-30"),
    loyerMensuel: 1200,
    statut: "ACTIF",
    augmentationAnnuelle: 0.9,
    sectionG: false,
    clausesSpeciales: "Animaux autorisés (1 chat maximum). Stationnement non inclus.",
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "bail_002",
    logementId: "log_rose_1er",
    locataireId: "loc_002",
    dateDebut: new Date("2023-09-01"),
    dateFin: new Date("2024-08-31"),
    loyerMensuel: 1400,
    statut: "ACTIF",
    augmentationAnnuelle: 0.9,
    sectionG: false,
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "bail_003",
    logementId: "log_rose_2e",
    locataireId: "loc_003",
    dateDebut: new Date("2023-09-01"),
    dateFin: new Date("2024-08-31"),
    loyerMensuel: 1250,
    statut: "ACTIF",
    augmentationAnnuelle: 0.9,
    sectionG: false,
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "bail_004",
    logementId: "log_vil_bas",
    locataireId: "loc_004",
    dateDebut: new Date("2023-05-01"),
    dateFin: new Date("2024-04-30"),
    loyerMensuel: 1350,
    statut: "EN_RENOUVELLEMENT",
    augmentationAnnuelle: 0.9,
    sectionG: false,
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2024-02-01"),
  },
];

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

function genererTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const maintenant = new Date();

  // Générer les loyers des 6 derniers mois
  for (let i = 5; i >= 0; i--) {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);

    // Loyers du triplex
    transactions.push(
      {
        id: `tx_loyer_rose_rdc_${i}`,
        immeubleId: "imm_triplex_rosemont",
        logementId: "log_rose_rdc",
        type: "REVENU",
        categorie: "LOYER",
        montant: 1200,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: "Loyer — Rez-de-chaussée",
        methodePaiement: "VIREMENT",
        recurrent: true,
        recurrenceJour: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: `tx_loyer_rose_1er_${i}`,
        immeubleId: "imm_triplex_rosemont",
        logementId: "log_rose_1er",
        type: "REVENU",
        categorie: "LOYER",
        montant: 1400,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: "Loyer — 1er étage",
        methodePaiement: "VIREMENT",
        recurrent: true,
        recurrenceJour: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: `tx_loyer_rose_2e_${i}`,
        immeubleId: "imm_triplex_rosemont",
        logementId: "log_rose_2e",
        type: "REVENU",
        categorie: "LOYER",
        montant: 1250,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: "Loyer — 2e étage",
        methodePaiement: "PRELEVEMENT",
        recurrent: true,
        recurrenceJour: 1,
        createdAt: date,
        updatedAt: date,
      },
      // Loyer du duplex
      {
        id: `tx_loyer_vil_bas_${i}`,
        immeubleId: "imm_duplex_villeray",
        logementId: "log_vil_bas",
        type: "REVENU",
        categorie: "LOYER",
        montant: 1350,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: "Loyer — Bas-duplex",
        methodePaiement: "VIREMENT",
        recurrent: true,
        recurrenceJour: 1,
        createdAt: date,
        updatedAt: date,
      }
    );
  }

  // Hypothèques mensuelles
  for (let i = 5; i >= 0; i--) {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 5);
    transactions.push(
      {
        id: `tx_hyp_rose_${i}`,
        immeubleId: "imm_triplex_rosemont",
        type: "DEPENSE",
        categorie: "HYPOTHEQUE",
        montant: 2850,
        date,
        description: "Hypothèque — Triplex Rosemont",
        methodePaiement: "PRELEVEMENT",
        recurrent: true,
        recurrenceJour: 5,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: `tx_hyp_vil_${i}`,
        immeubleId: "imm_duplex_villeray",
        type: "DEPENSE",
        categorie: "HYPOTHEQUE",
        montant: 2100,
        date,
        description: "Hypothèque — Duplex Villeray",
        methodePaiement: "PRELEVEMENT",
        recurrent: true,
        recurrenceJour: 5,
        createdAt: date,
        updatedAt: date,
      }
    );
  }

  // Dépenses ponctuelles
  transactions.push(
    {
      id: "tx_assurance_rose",
      immeubleId: "imm_triplex_rosemont",
      type: "DEPENSE",
      categorie: "ASSURANCE",
      montant: 1850,
      date: new Date(maintenant.getFullYear(), 0, 15),
      description: "Assurance habitation — Triplex Rosemont",
      fournisseur: "Intact Assurance",
      methodePaiement: "CHEQUE",
      recurrent: true,
      createdAt: new Date(maintenant.getFullYear(), 0, 15),
      updatedAt: new Date(maintenant.getFullYear(), 0, 15),
    },
    {
      id: "tx_taxes_mun_rose",
      immeubleId: "imm_triplex_rosemont",
      type: "DEPENSE",
      categorie: "TAXES_MUNICIPALES",
      montant: 4200,
      date: new Date(maintenant.getFullYear(), 0, 31),
      description: "Taxes municipales 2024 — Triplex Rosemont",
      fournisseur: "Ville de Montréal",
      methodePaiement: "PRELEVEMENT",
      recurrent: true,
      createdAt: new Date(maintenant.getFullYear(), 0, 31),
      updatedAt: new Date(maintenant.getFullYear(), 0, 31),
    },
    {
      id: "tx_reparation_plomb",
      immeubleId: "imm_triplex_rosemont",
      logementId: "log_rose_rdc",
      type: "DEPENSE",
      categorie: "REPARATION",
      montant: 385,
      date: new Date(maintenant.getFullYear(), maintenant.getMonth() - 2, 12),
      description: "Réparation robinet et tuyaux — Rez-de-chaussée",
      fournisseur: "Plomberie Lavoie Inc.",
      methodePaiement: "CHEQUE",
      recurrent: false,
      createdAt: new Date(maintenant.getFullYear(), maintenant.getMonth() - 2, 12),
      updatedAt: new Date(maintenant.getFullYear(), maintenant.getMonth() - 2, 12),
    },
    {
      id: "tx_deneigement",
      immeubleId: "imm_triplex_rosemont",
      type: "DEPENSE",
      categorie: "DENEIGEMENT",
      montant: 750,
      date: new Date(maintenant.getFullYear(), 10, 1),
      description: "Contrat de déneigement — Hiver 2023-2024",
      fournisseur: "Neige Express MTL",
      methodePaiement: "CHEQUE",
      recurrent: false,
      createdAt: new Date(maintenant.getFullYear(), 10, 1),
      updatedAt: new Date(maintenant.getFullYear(), 10, 1),
    },
    {
      id: "tx_renov_vil",
      immeubleId: "imm_duplex_villeray",
      logementId: "log_vil_haut",
      type: "DEPENSE",
      categorie: "RENOVATION",
      montant: 8500,
      date: new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 20),
      description: "Rénovation cuisine — Haut-duplex Villeray",
      fournisseur: "Construction Leblanc",
      methodePaiement: "VIREMENT",
      recurrent: false,
      notes: "Acompte 50%. Solde à la livraison.",
      createdAt: new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 20),
      updatedAt: new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 20),
    },
    {
      id: "tx_assurance_vil",
      immeubleId: "imm_duplex_villeray",
      type: "DEPENSE",
      categorie: "ASSURANCE",
      montant: 1450,
      date: new Date(maintenant.getFullYear(), 2, 22),
      description: "Assurance habitation — Duplex Villeray",
      fournisseur: "Desjardins Assurance",
      methodePaiement: "PRELEVEMENT",
      recurrent: true,
      createdAt: new Date(maintenant.getFullYear(), 2, 22),
      updatedAt: new Date(maintenant.getFullYear(), 2, 22),
    },
    // ── Duplex Anjou ─────────────────────────────────────────────────────────
    {
      id: "tx_achat_anjou",
      immeubleId: "imm_duplex_anjou",
      type: "DEPENSE",
      categorie: "AUTRE",
      montant: 829000,
      date: new Date("2026-03-20"),
      description: "Achat — 8450-8452 av. Sublaines, Anjou (Centris 10602915)",
      fournisseur: "Notaire",
      methodePaiement: "VIREMENT",
      recurrent: false,
      createdAt: new Date("2026-03-20"),
      updatedAt: new Date("2026-03-20"),
    },
    // Assurance mensuelle 160$/mois = 1 920$/an
    {
      id: "tx_assurance_anjou",
      immeubleId: "imm_duplex_anjou",
      type: "DEPENSE",
      categorie: "ASSURANCE",
      montant: 160,
      date: new Date(maintenant.getFullYear(), maintenant.getMonth(), 1),
      description: "Assurance habitation mensuelle — Duplex Anjou",
      fournisseur: "Intact Assurance",
      methodePaiement: "PRELEVEMENT",
      recurrent: true,
      recurrenceJour: 1,
      notes: "160 $/mois = 1 920 $/an",
      createdAt: new Date("2026-03-20"),
      updatedAt: new Date("2026-03-20"),
    }
  );

  return transactions;
}

export const transactions = genererTransactions();

// ─── DEMANDES D'ENTRETIEN ─────────────────────────────────────────────────────

export const demandesEntretien: DemandeEntretien[] = [
  {
    id: "dem_001",
    logementId: "log_rose_rdc",
    locataireId: "loc_001",
    titre: "Fuite sous l'évier de cuisine",
    description: "Petite fuite au niveau du siphon sous l'évier. Tache d'humidité dans l'armoire.",
    priorite: "HAUTE",
    statut: "TERMINEE",
    categorie: "PLOMBERIE",
    photos: [],
    dateOuverture: new Date("2024-01-08"),
    dateFermeture: new Date("2024-01-12"),
    cout: 385,
    fournisseurAssigne: "Plomberie Lavoie Inc.",
    notes: "Siphon remplacé. Joint refait.",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "dem_002",
    logementId: "log_rose_1er",
    locataireId: "loc_002",
    titre: "Radiateur qui fait du bruit",
    description: "Le radiateur du salon fait un bruit de claquement la nuit. Chauffage moins efficace.",
    priorite: "NORMALE",
    statut: "EN_COURS",
    categorie: "CHAUFFAGE",
    photos: [],
    dateOuverture: new Date("2024-02-03"),
    fournisseurAssigne: "Chauffage Confort Plus",
    notes: "Technicien venu faire diagnostic. Purgeur à remplacer. Pièce commandée.",
    createdAt: new Date("2024-02-03"),
    updatedAt: new Date("2024-02-07"),
  },
  {
    id: "dem_003",
    logementId: "log_vil_haut",
    titre: "Rénovation cuisine — travaux en cours",
    description: "Rénovation complète de la cuisine. Armoires, comptoir et plancher.",
    priorite: "NORMALE",
    statut: "EN_COURS",
    categorie: "AUTRE",
    photos: [],
    dateOuverture: new Date("2024-02-01"),
    fournisseurAssigne: "Construction Leblanc",
    cout: 17000,
    notes: "Livraison prévue fin mars 2024.",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "dem_004",
    logementId: "log_rose_2e",
    locataireId: "loc_003",
    titre: "Ampoules à remplacer dans la salle de bain",
    description: "3 ampoules grillées dans le plafonnier de la salle de bain.",
    priorite: "BASSE",
    statut: "NOUVELLE",
    categorie: "ELECTRICITE",
    photos: [],
    dateOuverture: new Date("2024-02-15"),
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
];

// ─── RAPPELS ─────────────────────────────────────────────────────────────────

export const rappels: Rappel[] = [
  {
    id: "rap_001",
    titre: "Renouvellement bail — Tremblay (RDC Rosemont)",
    description: "Envoyer l'avis de renouvellement 3 mois avant la fin du bail",
    date: new Date("2024-03-31"),
    recurrent: false,
    bailId: "bail_001",
    statut: "ACTIF",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "rap_002",
    titre: "Renouvellement bail — Esposito (Bas Villeray)",
    description: "Bail expire le 30 avril 2024. À renouveler.",
    date: new Date("2024-01-31"),
    recurrent: false,
    bailId: "bail_004",
    statut: "ACTIF",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "rap_003",
    titre: "Inspection annuelle — Triplex Rosemont",
    description: "Inspection de routine : toit, fondations, systèmes mécaniques",
    date: new Date("2024-05-15"),
    recurrent: true,
    frequence: "ANNUEL",
    immeubleId: "imm_triplex_rosemont",
    statut: "ACTIF",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "rap_004",
    titre: "Paiement taxes scolaires",
    description: "Taxes scolaires à payer avant le 15 août",
    date: new Date("2024-07-31"),
    recurrent: true,
    frequence: "ANNUEL",
    immeubleId: "imm_triplex_rosemont",
    statut: "ACTIF",
    createdAt: new Date("2024-01-01"),
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getImmeubleAvecLogements(id: string) {
  const immeuble = immeubles.find(i => i.id === id);
  if (!immeuble) return null;
  const logementsImmeuble = logements.filter(l => l.immeubleId === id);
  return { ...immeuble, logements: logementsImmeuble };
}

export function getLogementAvecDetails(id: string) {
  const logement = logements.find(l => l.id === id);
  if (!logement) return null;
  const immeuble = immeubles.find(i => i.id === logement.immeubleId);
  const locsLogement = locataires.filter(l => l.logementId === id);
  const bauxLogement = baux.filter(b => b.logementId === id);
  return { ...logement, immeuble, locataires: locsLogement, baux: bauxLogement };
}

export function getStatsFinancieresMois(annee: number, mois: number) {
  const debut = new Date(annee, mois, 1);
  const fin = new Date(annee, mois + 1, 0);

  const txMois = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= debut && d <= fin;
  });

  const revenus = txMois
    .filter(t => t.type === "REVENU")
    .reduce((sum, t) => sum + t.montant, 0);

  const depenses = txMois
    .filter(t => t.type === "DEPENSE")
    .reduce((sum, t) => sum + t.montant, 0);

  return { revenus, depenses, profit: revenus - depenses };
}

export function getStatsParMois(nbMois = 6) {
  const maintenant = new Date();
  const result = [];

  for (let i = nbMois - 1; i >= 0; i--) {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
    const stats = getStatsFinancieresMois(date.getFullYear(), date.getMonth());
    const nomMois = date.toLocaleDateString("fr-CA", { month: "short" });
    result.push({
      mois: nomMois,
      revenus: stats.revenus,
      depenses: stats.depenses,
      profit: stats.profit,
    });
  }

  return result;
}

export function getTauxOccupation() {
  const nbTotal = logements.length;
  const nbOccupes = logements.filter(l => l.statut === "OCCUPE").length;
  return { nbTotal, nbOccupes, taux: (nbOccupes / nbTotal) * 100 };
}
