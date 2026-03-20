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
    id: "imm_triplex_laval",
    nom: "Triplex Laval — Hébert",
    adresse: "1671-1675, rue Hébert",
    ville: "Laval (Chomedey)",
    province: "QC",
    codePostal: "H7V 3L6",
    type: "TRIPLEX",
    anneeConstruct: 1955,
    nbLogements: 3,
    photoUrl: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
    dateAchat: new Date("2023-10-01"),
    prixAchat: 749000,
    valeurMunicipale: 571300,
    numeroLot: "1219812",
    notes:
      "Triplex semi-détaché construit en 1955. Revêtement acrylique (SIFE). " +
      "Lot 15.24×24.38m = 371 m² · Bâtiment 11.73×8.63m irr. = 196.58 m² habitables. " +
      "Certificat de localisation 2009 — à mettre à jour. " +
      "VENTE SANS GARANTIE LÉGALE de qualité, aux risques de l'acheteur. " +
      "Refinancement signé déc. 2025 (First National #1386552). " +
      "Évaluation marchande sept. 2025 par Alexia Lévesque-Montmarquette RE/MAX : 849 000 $. " +
      "MRB 18.91 · Prix/porte 249 667 $. Taxes 2023: 5 531 $ (mun. 5 043 $ + scol. 488 $).",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-01-15"),
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
  // ── Triplex Laval — 1671 (rez-de-chaussée/sous-sol, 5 pces, 3 ch, loyer 1200$) ──
  {
    id: "log_lav_1671",
    immeubleId: "imm_triplex_laval",
    numero: "1671",
    superficie: 700,
    nbChambres: 3,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 1200,
    inclChauffage: false,
    inclEauChaude: false,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: false,
    photos: [],
    notes:
      "5 pièces. Bail expiré juin 2024 — renouvelé. " +
      "Plafond avec cernes d'eau (dégât antérieur). " +
      "Panneau électrique 100A cuivre PLEIN — hotte cuisine sans couvercle. " +
      "Moustiquaire cuisine endommagée.",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-01-01"),
  },
  // ── Triplex Laval — 1675 (unité principale, 5 pces, 3 ch, loyer 950$) ──
  {
    id: "log_lav_1675",
    immeubleId: "imm_triplex_laval",
    numero: "1675",
    superficie: 720,
    nbChambres: 3,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 950,
    inclChauffage: false,
    inclEauChaude: false,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: false,
    photos: [],
    notes:
      "5 pièces. Bail expiré juin 2024 — renouvelé. " +
      "Prises élec. cuisine non fonctionnelles. Panneau 100A PLEIN, disjoncteurs non identifiés. " +
      "Plafonds avec cernes d'eau. Portes intérieures endommagées. " +
      "Robinetterie lavabo mal fixée. Disjoncteurs à étiqueter.",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-01-01"),
  },
  // ── Triplex Laval — 1671A (logement supplémentaire, 4 pces, 2 ch, loyer 1150$) ──
  {
    id: "log_lav_1671a",
    immeubleId: "imm_triplex_laval",
    numero: "1671A",
    superficie: 660,
    nbChambres: 2,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 1150,
    inclChauffage: false,
    inclEauChaude: false,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: false,
    photos: [],
    notes:
      "4 pièces. Bail expiré juin 2024 — renouvelé. " +
      "DANGER: panneau élec. 200A — ouvertures non obturées (maître électricien urgent). " +
      "Fenêtre avant: infiltration d'eau + moisissures/pourriture sur cadrage. " +
      "Plinthes électriques non fonctionnelles (inspection sept. 2023). " +
      "Chauffe-eau remplacé sept. 2025 (Confort Expert/HydroSolution).",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-01-01"),
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
  // ── Triplex Laval ──────────────────────────────────────────────────────────
  {
    id: "loc_lav_001",
    logementId: "log_lav_1671",
    prenom: "Linda",
    nom: "Bouchard",
    email: "linda.bouchard@gmail.com",
    telephone: "450-555-3412",
    statut: "ACTIF",
    notes: "Locataire depuis 2021. Bail renouvelé 2024. Loyer 1 200 $/mois.",
    createdAt: new Date("2021-07-01"),
    updatedAt: new Date("2024-07-01"),
  },
  {
    id: "loc_lav_002",
    logementId: "log_lav_1675",
    prenom: "Kevin",
    nom: "Ouellet",
    email: "k.ouellet@outlook.com",
    telephone: "450-555-8820",
    statut: "ACTIF",
    notes: "Locataire depuis 2022. Loyer 950 $/mois. Inclusions : électroménagers sous-sol.",
    createdAt: new Date("2022-09-01"),
    updatedAt: new Date("2024-07-01"),
  },
  {
    id: "loc_lav_003",
    logementId: "log_lav_1671a",
    prenom: "Nadia",
    nom: "Perreault",
    email: "nadia.perreault@hotmail.com",
    telephone: "450-555-6671",
    statut: "ACTIF",
    notes: "Locataire depuis 2020. Loyer 1 150 $/mois. A signalé les plinthes non fonctionnelles.",
    createdAt: new Date("2020-10-01"),
    updatedAt: new Date("2024-07-01"),
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
  // ── Triplex Laval — baux en vigueur (renouvelés juillet 2024) ─────────────
  {
    id: "bail_lav_001",
    logementId: "log_lav_1671",
    locataireId: "loc_lav_001",
    dateDebut: new Date("2024-07-01"),
    dateFin: new Date("2025-06-30"),
    loyerMensuel: 1200,
    statut: "EXPIRE",
    augmentationAnnuelle: 0.9,
    sectionG: true,
    clausesSpeciales: "Bail original expiré 2024-06-30. Reconduit tacitement.",
    createdAt: new Date("2021-07-01"),
    updatedAt: new Date("2024-07-01"),
  },
  {
    id: "bail_lav_002",
    logementId: "log_lav_1675",
    locataireId: "loc_lav_002",
    dateDebut: new Date("2024-07-01"),
    dateFin: new Date("2025-06-30"),
    loyerMensuel: 950,
    statut: "EXPIRE",
    augmentationAnnuelle: 0.9,
    sectionG: true,
    clausesSpeciales: "Électroménagers sous-sol inclus selon bail. RDC et 2e étage exclus.",
    createdAt: new Date("2022-09-01"),
    updatedAt: new Date("2024-07-01"),
  },
  {
    id: "bail_lav_003",
    logementId: "log_lav_1671a",
    locataireId: "loc_lav_003",
    dateDebut: new Date("2024-07-01"),
    dateFin: new Date("2025-06-30"),
    loyerMensuel: 1150,
    statut: "EN_RENOUVELLEMENT",
    augmentationAnnuelle: 0.9,
    sectionG: true,
    createdAt: new Date("2020-10-01"),
    updatedAt: new Date("2024-07-01"),
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
    // ── Loyers mensuels Triplex Laval ────────────────────────────────────────
    ...([0, 1, 2, 3, 4, 5] as const).flatMap((i) => {
      const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
      return [
        {
          id: `tx_loyer_lav_1671_${i}`,
          immeubleId: "imm_triplex_laval",
          logementId: "log_lav_1671",
          type: "REVENU" as const,
          categorie: "LOYER" as const,
          montant: 1200,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — 1671",
          methodePaiement: "VIREMENT" as const,
          recurrent: true,
          recurrenceJour: 1,
          createdAt: date,
          updatedAt: date,
        },
        {
          id: `tx_loyer_lav_1675_${i}`,
          immeubleId: "imm_triplex_laval",
          logementId: "log_lav_1675",
          type: "REVENU" as const,
          categorie: "LOYER" as const,
          montant: 950,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — 1675",
          methodePaiement: "VIREMENT" as const,
          recurrent: true,
          recurrenceJour: 1,
          createdAt: date,
          updatedAt: date,
        },
        {
          id: `tx_loyer_lav_1671a_${i}`,
          immeubleId: "imm_triplex_laval",
          logementId: "log_lav_1671a",
          type: "REVENU" as const,
          categorie: "LOYER" as const,
          montant: 1150,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — 1671A",
          methodePaiement: "PRELEVEMENT" as const,
          recurrent: true,
          recurrenceJour: 1,
          createdAt: date,
          updatedAt: date,
        },
        {
          id: `tx_hyp_lav_${i}`,
          immeubleId: "imm_triplex_laval",
          type: "DEPENSE" as const,
          categorie: "HYPOTHEQUE" as const,
          montant: 3850,
          date: new Date(date.getFullYear(), date.getMonth(), 5),
          description: "Hypothèque First National #1386552 — Triplex Laval",
          methodePaiement: "PRELEVEMENT" as const,
          recurrent: true,
          recurrenceJour: 5,
          createdAt: date,
          updatedAt: date,
        },
      ];
    }),
    // Taxes municipales + scolaires 2023 Laval
    {
      id: "tx_taxes_mun_lav",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE",
      categorie: "TAXES_MUNICIPALES",
      montant: 5043,
      date: new Date(maintenant.getFullYear(), 0, 31),
      description: "Taxes municipales 2023 — Triplex Laval",
      fournisseur: "Ville de Laval",
      methodePaiement: "PRELEVEMENT",
      recurrent: true,
      createdAt: new Date(maintenant.getFullYear(), 0, 31),
      updatedAt: new Date(maintenant.getFullYear(), 0, 31),
    },
    {
      id: "tx_taxes_sco_lav",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE",
      categorie: "TAXES_SCOLAIRES",
      montant: 488,
      date: new Date(maintenant.getFullYear(), 7, 15),
      description: "Taxes scolaires 2023 — Triplex Laval",
      fournisseur: "CS des Samares",
      methodePaiement: "CHEQUE",
      recurrent: true,
      createdAt: new Date(maintenant.getFullYear(), 7, 15),
      updatedAt: new Date(maintenant.getFullYear(), 7, 15),
    },
    // Refinancement frais notariaux déc. 2025
    {
      id: "tx_notaire_lav_refin",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE",
      categorie: "AUTRE",
      montant: 1860, // 1250 + taxes + 610
      date: new Date("2025-12-15"),
      description: "Honoraires notariales refinancement — Me Olga Tanasov (1 860 $)",
      fournisseur: "Me Olga Tanasov",
      methodePaiement: "CHEQUE",
      recurrent: false,
      notes: "1 250 $ + taxes + 610 $ frais de publication",
      createdAt: new Date("2025-12-15"),
      updatedAt: new Date("2025-12-15"),
    },
    // Chauffe-eau 1671A remplacé sept. 2025 (HydroSolution)
    {
      id: "tx_chauffe_eau_lav_1671a",
      immeubleId: "imm_triplex_laval",
      logementId: "log_lav_1671a",
      type: "DEPENSE",
      categorie: "REPARATION",
      montant: 1200,
      date: new Date("2025-09-15"),
      description: "Remplacement chauffe-eau 180L — 1671A (Confort Expert/HydroSolution)",
      fournisseur: "HydroSolution",
      methodePaiement: "VIREMENT",
      recurrent: false,
      createdAt: new Date("2025-09-15"),
      updatedAt: new Date("2025-09-15"),
    },
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

  // ══ TRIPLEX LAVAL — Rapport BatiXpert 26 sept. 2023 ══════════════════════

  // 🔴 URGENTS
  {
    id: "dem_lav_001",
    logementId: "log_lav_1671a",
    titre: "⚡ Panneau électrique 1671A — ouvertures non obturées",
    description:
      "Rapport d'inspection BatiXpert (26 sept. 2023, Mohammed Safieh) : " +
      "ouvertures non obturées dans le panneau 200A de l'unité 1671A (chambre). " +
      "DANGER IMMÉDIAT — risque d'arc électrique, de choc ou d'incendie. " +
      "Intervention d'un maître électricien certifié (CMEQ) requise IMMÉDIATEMENT.",
    priorite: "URGENTE",
    statut: "NOUVELLE",
    categorie: "ELECTRICITE",
    photos: [],
    dateOuverture: new Date("2023-09-26"),
    notes: "Ne pas ignorer. Obligatoire pour maintenir l'assurabilité du bâtiment.",
    createdAt: new Date("2023-09-26"),
    updatedAt: new Date("2023-09-26"),
  },
  {
    id: "dem_lav_002",
    logementId: "log_lav_1675",
    titre: "⚡ Prises électriques cuisine 1675 — non fonctionnelles",
    description:
      "Rapport BatiXpert : prises de la cuisine au 1675 non fonctionnelles. " +
      "Cause inconnue — court-circuit, disjoncteur défectueux ou câblage défaillant. " +
      "Maître électricien requis pour diagnostic et réparation.",
    priorite: "URGENTE",
    statut: "NOUVELLE",
    categorie: "ELECTRICITE",
    photos: [],
    dateOuverture: new Date("2023-09-26"),
    notes: "Locataire actif dans l'unité — corriger rapidement.",
    createdAt: new Date("2023-09-26"),
    updatedAt: new Date("2023-09-26"),
  },
  {
    id: "dem_lav_003",
    logementId: "log_lav_1671",
    titre: "🚰 Valve d'eau principale — corrosion, ne pas opérer",
    description:
      "Rapport BatiXpert : valve d'eau principale avec rouille et corrosion importante. " +
      "Ne doit PAS être opérée dans l'état actuel (risque de bris et inondation). " +
      "Remplacement par un plombier certifié avant tout entretien ou urgence plomberie.",
    priorite: "URGENTE",
    statut: "EN_COURS",
    categorie: "PLOMBERIE",
    photos: [],
    dateOuverture: new Date("2023-09-26"),
    notes: "Risque majeur en cas d'urgence plomberie — prioriser avant l'hiver.",
    createdAt: new Date("2023-09-26"),
    updatedAt: new Date("2023-10-15"),
  },
  {
    id: "dem_lav_004",
    logementId: "log_lav_1671",
    titre: "🛡️ Clapet anti-refoulement — absent ou non visible",
    description:
      "Rapport BatiXpert : clapet anti-refoulement absent ou non localisable. " +
      "Certains assureurs l'exigent pour couvrir les dégâts d'égout. " +
      "Installation par plombier certifié — vérifier avec votre assureur.",
    priorite: "HAUTE",
    statut: "NOUVELLE",
    categorie: "PLOMBERIE",
    photos: [],
    dateOuverture: new Date("2023-09-26"),
    notes: "Contacter l'assureur pour confirmer l'obligation avant travaux.",
    createdAt: new Date("2023-09-26"),
    updatedAt: new Date("2023-09-26"),
  },

  // 🟠 IMPORTANTS
  {
    id: "dem_lav_005",
    logementId: "log_lav_1671a",
    titre: "🪟 Fenêtre 1671A — infiltration eau + moisissures",
    description:
      "Rapport BatiXpert : infiltration d'eau au niveau de la fenêtre avant de l'unité 1671A. " +
      "Moisissures et pourriture observées sur le cadrage. " +
      "Expertise requise pour évaluer l'étendue des dommages (risque structure).",
    priorite: "HAUTE",
    statut: "NOUVELLE",
    categorie: "STRUCTURE",
    photos: [],
    dateOuverture: new Date("2023-09-26"),
    notes: "Expert en bâtiment ou inspecteur spécialisé moisissures recommandé.",
    createdAt: new Date("2023-09-26"),
    updatedAt: new Date("2023-09-26"),
  },
  {
    id: "dem_lav_006",
    logementId: "log_lav_1671a",
    titre: "🌡️ Plinthes électriques 1671A — non fonctionnelles",
    description:
      "Rapport BatiXpert : plinthes électriques de l'unité 1671A non fonctionnelles au moment de l'inspection. " +
      "Locataire sans chauffage adéquat — risque en période hivernale.",
    priorite: "HAUTE",
    statut: "NOUVELLE",
    categorie: "CHAUFFAGE",
    photos: [],
    dateOuverture: new Date("2023-09-26"),
    notes: "Vérifier si réparé depuis. Si non, électricien CMEQ requis.",
    createdAt: new Date("2023-09-26"),
    updatedAt: new Date("2023-09-26"),
  },
  {
    id: "dem_lav_007",
    logementId: "log_lav_1675",
    titre: "🚪 Portes intérieures 1675 — endommagées",
    description:
      "Rapport BatiXpert : plusieurs portes intérieures endommagées dans l'unité 1675. " +
      "Remplacement requis.",
    priorite: "NORMALE",
    statut: "NOUVELLE",
    categorie: "AUTRE",
    photos: [],
    dateOuverture: new Date("2023-09-26"),
    createdAt: new Date("2023-09-26"),
    updatedAt: new Date("2023-09-26"),
  },
  {
    id: "dem_lav_008",
    logementId: "log_lav_1675",
    titre: "💧 Plafonds 1675 — cernes d'eau",
    description:
      "Rapport BatiXpert : cernes d'eau visibles aux plafonds du 1675. " +
      "Possible dégât antérieur. Vérifier source (toit, plomberie). Risque moisissures.",
    priorite: "NORMALE",
    statut: "NOUVELLE",
    categorie: "STRUCTURE",
    photos: [],
    dateOuverture: new Date("2023-09-26"),
    createdAt: new Date("2023-09-26"),
    updatedAt: new Date("2023-09-26"),
  },
  {
    id: "dem_lav_009",
    logementId: "log_lav_1671",
    titre: "💧 Plafonds 1671 — cernes d'eau, risque moisissures",
    description:
      "Rapport BatiXpert : cernes d'eau aux plafonds du 1671. " +
      "Source à identifier. Risque de moisissures si humidité persistante.",
    priorite: "NORMALE",
    statut: "NOUVELLE",
    categorie: "STRUCTURE",
    photos: [],
    dateOuverture: new Date("2023-09-26"),
    createdAt: new Date("2023-09-26"),
    updatedAt: new Date("2023-09-26"),
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

  // ── Triplex Laval ─────────────────────────────────────────────────────────
  {
    id: "rap_lav_001",
    titre: "⚠️ Certificat de localisation — Hébert (2009, à mettre à jour)",
    description:
      "Le certificat de localisation date de 2009. Il est recommandé de le mettre à jour " +
      "avant toute vente, refinancement ou réclamation d'assurance. " +
      "Coût estimé : 800–1 500 $. Contacter un arpenteur-géomètre.",
    date: new Date("2026-06-01"),
    recurrent: false,
    immeubleId: "imm_triplex_laval",
    statut: "ACTIF",
    createdAt: new Date("2023-10-01"),
  },
  {
    id: "rap_lav_002",
    titre: "Renouvellement bail — 1671 (Linda Bouchard)",
    description: "Bail expiré juin 2025 — envoyer avis de renouvellement 90 jours avant.",
    date: new Date("2026-04-01"),
    recurrent: false,
    bailId: "bail_lav_001",
    statut: "ACTIF",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "rap_lav_003",
    titre: "Renouvellement bail — 1675 (Kevin Ouellet)",
    description: "Bail expiré juin 2025 — envoyer avis de renouvellement 90 jours avant.",
    date: new Date("2026-04-01"),
    recurrent: false,
    bailId: "bail_lav_002",
    statut: "ACTIF",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "rap_lav_004",
    titre: "Renouvellement bail — 1671A (Nadia Perreault)",
    description: "Bail en renouvellement — à confirmer avec locataire.",
    date: new Date("2026-04-01"),
    recurrent: false,
    bailId: "bail_lav_003",
    statut: "ACTIF",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "rap_lav_005",
    titre: "Taxes scolaires Laval — Paiement annuel",
    description: "Taxes scolaires 488 $ — CS des Samares, à payer avant le 15 août.",
    date: new Date(new Date().getFullYear(), 7, 1),
    recurrent: true,
    frequence: "ANNUEL",
    immeubleId: "imm_triplex_laval",
    statut: "ACTIF",
    createdAt: new Date("2023-10-01"),
  },
  {
    id: "rap_lav_006",
    titre: "Évaluation marchande — mise à jour (RE/MAX du Cartier)",
    description:
      "Dernière évaluation : 849 000 $ (sept. 2025, Alexia Lévesque-Montmarquette). " +
      "Mettre à jour annuellement pour suivi de la valeur du portefeuille.",
    date: new Date("2026-09-01"),
    recurrent: true,
    frequence: "ANNUEL",
    immeubleId: "imm_triplex_laval",
    statut: "ACTIF",
    createdAt: new Date("2025-09-01"),
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
