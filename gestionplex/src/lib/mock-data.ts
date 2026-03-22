// Données de démonstration pour GestionPlex
// Ces données simulent la base de données Supabase/Prisma

import type {
  Immeuble, Logement, Locataire, Bail, Transaction,
  DemandeEntretien, Rappel
} from "@/types";

// ─── IMMEUBLES ───────────────────────────────────────────────────────────────

export const immeubles: Immeuble[] = [
  {
    id: "imm_triplex_laval",
    nom: "Triplex Laval — Hébert",
    adresse: "1671-1675, rue Hébert",
    ville: "Laval (Chomedey)",
    province: "QC",
    codePostal: "H7V 3L6",
    type: "TRIPLEX",
    anneeConstruct: 1960,
    nbLogements: 3,
    photoUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    coordinates: { lat: 45.5517, lng: -73.7571 },
    dateAchat: new Date("2023-10-01"),
    prixAchat: 749000,
    valeurMunicipale: 776100,
    numeroLot: "1219812",
    notes:
      "Triplex acheté oct. 2023. Refinancé déc. 2025 (BNC — Banque Nationale). " +
      "Matricule : 65005 8445 78 3147 1 000 0000. Rôle 2025-2027 : 776 100 $. " +
      "2 étages · 371,60 m² · mesure frontale 15,24 m. " +
      "Évaluation marchande : 849 000 $ (RE/MAX du Cartier, sept. 2025). " +
      "Certificat de localisation 2009 — à mettre à jour.",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "imm_duplex_anjou",
    nom: "Duplex Anjou — Sublaines",
    adresse: "8450-8452, av. Sublaines",
    ville: "Montréal (Anjou)",
    province: "QC",
    codePostal: "H1K 2B9",
    type: "DUPLEX",
    anneeConstruct: 1960,
    nbLogements: 2,
    photoUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    coordinates: { lat: 45.5984, lng: -73.5506 },
    dateAchat: new Date("2026-03-20"),
    prixAchat: 829000,
    valeurMunicipale: 774000,
    numeroLot: "Centris #10602915",
    notes:
      "Duplex jumelé, acquis mars 2026. " +
      "8452 (haut) : vacant, en rénovation, valeur locative cible 2 750 $/mois. " +
      "8450 (bas) : habité par le propriétaire (Amine). " +
      "Assurance : 160 $/mois. Travaux : planchers, SDB, cuisines, élec, thermopompe.",
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-03-20"),
  },
];

// ─── LOGEMENTS ───────────────────────────────────────────────────────────────

export const logements: Logement[] = [
  // ── Triplex Laval — 1671 (Mohamad Salma) ──
  {
    id: "log_lav_1671",
    immeubleId: "imm_triplex_laval",
    numero: "1671",
    superficie: 700,
    nbChambres: 3,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 1700,
    inclChauffage: false,
    inclEauChaude: false,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: false,
    photos: [],
    notes:
      "5 pièces. Locataire actuel : Benny-bee · 1 700 $/mois (2026). Bail précédent : Mohamad Salma 1 285 $/mois (+4,90 % TAL 2025). " +
      "Plafond avec cernes d'eau (dégât antérieur). " +
      "Panneau électrique 100A cuivre PLEIN — hotte cuisine sans couvercle. " +
      "Moustiquaire cuisine endommagée.",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2025-06-30"),
  },
  // ── Triplex Laval — 1675 (Jennifer Bindala) ──
  {
    id: "log_lav_1675",
    immeubleId: "imm_triplex_laval",
    numero: "1675",
    superficie: 720,
    nbChambres: 3,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 2000,
    inclChauffage: false,
    inclEauChaude: false,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: false,
    photos: [],
    notes:
      "5 pièces. Locataire : Ezechielle-Jennifer Bindala · 2 000 $/mois. Avis augmentation envoyé 2026. " +
      "Prises élec. cuisine non fonctionnelles. Panneau 100A PLEIN, disjoncteurs non identifiés. " +
      "Plafonds avec cernes d'eau. Portes intérieures endommagées. " +
      "Robinetterie lavabo mal fixée.",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-01-01"),
  },
  // ── Triplex Laval — 1671A (Lyes Sadaoui) ──
  {
    id: "log_lav_1671a",
    immeubleId: "imm_triplex_laval",
    numero: "1671A",
    superficie: 660,
    nbChambres: 2,
    nbSallesBain: 1,
    statut: "OCCUPE",
    loyerMensuel: 1190,
    inclChauffage: false,
    inclEauChaude: false,
    inclElectricite: false,
    inclStationnement: false,
    inclRangement: false,
    photos: [],
    notes:
      "4 pièces. Bail 2025-06-30 → 2026-06-30 · 1 190 $/mois. " +
      "Renouvellement proposé 2026-06-30 → 2027-06-30 · 1 220 $/mois (+2,60 % TAL). Avis envoyé 2026-02-19. " +
      "DANGER: panneau élec. 200A — ouvertures non obturées (maître électricien urgent). " +
      "Fenêtre avant: infiltration d'eau + moisissures/pourriture sur cadrage. " +
      "Plinthes électriques non fonctionnelles (inspection sept. 2023). " +
      "Chauffe-eau remplacé sept. 2025 (Confort Expert/HydroSolution).",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-02-19"),
  },
  // ── Duplex Anjou — 8452 (haut, vacant) ──
  {
    id: "log_anj_haut",
    immeubleId: "imm_duplex_anjou",
    numero: "8452 — Haut",
    superficie: 1087,
    nbChambres: 4,
    nbSallesBain: 2,
    statut: "EN_RENOVATION",
    loyerMensuel: 0,
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
  // ── Duplex Anjou — 8450 (bas, propriétaire) ──
  {
    id: "log_anj_bas",
    immeubleId: "imm_duplex_anjou",
    numero: "8450 — Bas (propriétaire)",
    superficie: 1087,
    nbChambres: 3,
    nbSallesBain: 1,
    statut: "EN_RENOVATION",
    loyerMensuel: 0,
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
];

// ─── LOCATAIRES ──────────────────────────────────────────────────────────────

export const locataires: Locataire[] = [
  // ── Triplex Laval — locataires actifs ──
  {
    id: "loc_lav_001",
    logementId: "log_lav_1671",
    prenom: "Benny-bee",
    nom: "",
    email: "",
    telephone: "",
    statut: "ACTIF",
    notes: "1671 Rue Hébert · 1 700 $/mois (locataire actuel 2026). Ancien locataire : Mohamad Salma (bail 2025-06-30 → 2026-06-30, 1 285$/mois, +4,90 % TAL).",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "loc_lav_002",
    logementId: "log_lav_1675",
    prenom: "Ezechielle-Jennifer",
    nom: "Bindala",
    email: "",
    telephone: "",
    statut: "ACTIF",
    notes: "1675 Rue Hébert · 2 000 $/mois. Avis TAL d'augmentation envoyé 2026. Anciens locataires : Jennifer Philip (2023), Karim Chebbi (2024).",
    createdAt: new Date("2025-07-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "loc_lav_003",
    logementId: "log_lav_1671a",
    prenom: "Lyes",
    nom: "Sadaoui",
    email: "",
    telephone: "",
    statut: "ACTIF",
    notes: "1671A Rue Hébert · 1 190 $/mois · bail 2025-06-30 → 2026-06-30. Renouvellement proposé 1 220 $/mois (+2,60 %) du 2026-06-30 au 2027-06-30. Avis envoyé 2026-02-19. RL-31 émis 2023, 2024, 2025.",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-02-19"),
  },
  // ── Anciens locataires ──
  {
    id: "loc_lav_004",
    logementId: "log_lav_1675",
    prenom: "Karim",
    nom: "Chebbi",
    email: "",
    telephone: "",
    statut: "ANCIEN",
    notes: "1675 Rue Hébert — locataire 2024. RL-31 émis 2024. Remplacé par Jennifer Bindala.",
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2025-06-30"),
  },
  {
    id: "loc_lav_005",
    logementId: "log_lav_1675",
    prenom: "Jennifer",
    nom: "Philip",
    email: "",
    telephone: "",
    statut: "ANCIEN",
    notes: "1675 Rue Hébert — locataire 2023. RL-31 émis 2023.",
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2024-06-30"),
  },
];

// ─── BAUX ────────────────────────────────────────────────────────────────────

export const baux: Bail[] = [
  // ── 1671 — Mohamad Salma (bail actif) ──
  {
    id: "bail_lav_001",
    logementId: "log_lav_1671",
    locataireId: "loc_lav_001",
    dateDebut: new Date("2025-06-30"),
    dateFin: new Date("2026-06-30"),
    loyerMensuel: 1285,
    statut: "ACTIF",
    augmentationAnnuelle: 4.9,
    sectionG: true,
    clausesSpeciales: "Avis TAL envoyé 2025-03-01. Loyer augmenté de 1 225 $ à 1 285 $ (+4,90 % TAL 2025).",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2025-06-30"),
  },
  // ── 1675 — Jennifer Bindala (bail actif) ──
  {
    id: "bail_lav_002",
    logementId: "log_lav_1675",
    locataireId: "loc_lav_002",
    dateDebut: new Date("2025-07-01"),
    dateFin: new Date("2026-06-30"),
    loyerMensuel: 2000,
    statut: "EN_RENOUVELLEMENT",
    augmentationAnnuelle: 0.9,
    sectionG: true,
    clausesSpeciales: "Avis TAL envoyé 2026. Loyer actuel : 2 000 $/mois. Renouvellement en cours.",
    createdAt: new Date("2025-07-01"),
    updatedAt: new Date("2026-01-01"),
  },
  // ── 1671A — Lyes Sadaoui (bail actif, renouvellement proposé) ──
  {
    id: "bail_lav_003",
    logementId: "log_lav_1671a",
    locataireId: "loc_lav_003",
    dateDebut: new Date("2025-06-30"),
    dateFin: new Date("2026-06-30"),
    loyerMensuel: 1190,
    statut: "EN_RENOUVELLEMENT",
    augmentationAnnuelle: 2.6,
    sectionG: true,
    clausesSpeciales: "Avis TAL envoyé 2026-02-19. Renouvellement proposé : 1 220 $/mois (+2,60 %) du 2026-06-30 au 2027-06-30.",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-02-19"),
  },
];

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

function genererTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const maintenant = new Date();

  // Loyers Triplex Laval — 6 derniers mois (loyers réels)
  for (let i = 5; i >= 0; i--) {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
    transactions.push(
      {
        id: `tx_loyer_lav_1671_${i}`,
        immeubleId: "imm_triplex_laval",
        logementId: "log_lav_1671",
        type: "REVENU",
        categorie: "LOYER",
        montant: 1700,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: `Loyer — 1671 (Benny-bee)`,
        methodePaiement: "VIREMENT",
        recurrent: true,
        recurrenceJour: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: `tx_loyer_lav_1675_${i}`,
        immeubleId: "imm_triplex_laval",
        logementId: "log_lav_1675",
        type: "REVENU",
        categorie: "LOYER",
        montant: 2000,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: `Loyer — 1675 (Jennifer Bindala)`,
        methodePaiement: "VIREMENT",
        recurrent: true,
        recurrenceJour: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: `tx_loyer_lav_1671a_${i}`,
        immeubleId: "imm_triplex_laval",
        logementId: "log_lav_1671a",
        type: "REVENU",
        categorie: "LOYER",
        montant: 1190,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: "Loyer — 1671A (Lyes Sadaoui)",
        methodePaiement: "PRELEVEMENT",
        recurrent: true,
        recurrenceJour: 1,
        createdAt: date,
        updatedAt: date,
      },
      // Hypothèque BNC — 1 597 $ aux deux semaines (versements ~1er et ~15 du mois)
      {
        id: `tx_hyp_lav_v1_${i}`,
        immeubleId: "imm_triplex_laval",
        type: "DEPENSE",
        categorie: "HYPOTHEQUE",
        montant: 1597,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: "Hypothèque BNC — Triplex Laval (versement aux 2 sem.)",
        fournisseur: "BNC — Banque Nationale du Canada",
        methodePaiement: "PRELEVEMENT",
        recurrent: true,
        recurrenceJour: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: `tx_hyp_lav_v2_${i}`,
        immeubleId: "imm_triplex_laval",
        type: "DEPENSE",
        categorie: "HYPOTHEQUE",
        montant: 1597,
        date: new Date(date.getFullYear(), date.getMonth(), 15),
        description: "Hypothèque BNC — Triplex Laval (versement aux 2 sem.)",
        fournisseur: "BNC — Banque Nationale du Canada",
        methodePaiement: "PRELEVEMENT",
        recurrent: true,
        recurrenceJour: 15,
        createdAt: date,
        updatedAt: date,
      }
    );
  }

  // Dépenses ponctuelles Laval — données réelles
  transactions.push(
    // ── Taxes foncières 2025 (5 124,78 $ — 2 versements) ──
    {
      id: "tx_taxes_mun_lav_2025_v1",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "TAXES_MUNICIPALES",
      montant: 2515.43,
      date: new Date("2025-03-19"),
      description: "Taxes foncières 2025 — Versement 1 · 1671-1675 Hébert (Ville de Laval · facture AN2025-000040032)",
      fournisseur: "Ville de Laval",
      methodePaiement: "VIREMENT",
      recurrent: false,
      createdAt: new Date("2025-03-19"),
      updatedAt: new Date("2025-03-19"),
    },
    {
      id: "tx_taxes_mun_lav_2025_v2",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "TAXES_MUNICIPALES",
      montant: 2609.35,
      date: new Date("2025-06-17"),
      description: "Taxes foncières 2025 — Versement 2 · 1671-1675 Hébert (Ville de Laval · facture AN2025-000040032)",
      fournisseur: "Ville de Laval",
      methodePaiement: "VIREMENT",
      recurrent: false,
      createdAt: new Date("2025-06-17"),
      updatedAt: new Date("2025-06-17"),
    },
    // ── Taxes foncières 2026 (5 640,58 $ — 2 versements) ──
    {
      id: "tx_taxes_mun_lav_2026_v1",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "TAXES_MUNICIPALES",
      montant: 2820.29,
      date: new Date("2026-03-18"),
      description: "Taxes foncières 2026 — Versement 1 · 1671-1675 Hébert (Ville de Laval · facture AN2026-000180113)",
      fournisseur: "Ville de Laval",
      methodePaiement: "VIREMENT",
      recurrent: false,
      createdAt: new Date("2026-03-18"),
      updatedAt: new Date("2026-03-18"),
    },
    {
      id: "tx_taxes_mun_lav_2026_v2",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "TAXES_MUNICIPALES",
      montant: 2820.29,
      date: new Date("2026-06-16"),
      description: "Taxes foncières 2026 — Versement 2 · 1671-1675 Hébert (Ville de Laval · facture AN2026-000180113)",
      fournisseur: "Ville de Laval",
      methodePaiement: "VIREMENT",
      recurrent: false,
      createdAt: new Date("2026-06-16"),
      updatedAt: new Date("2026-06-16"),
    },
    // ── Taxe scolaire 2025-2026 (517,65 $ — 2 versements) ──
    {
      id: "tx_taxes_sco_lav_2025_v1",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "TAXES_SCOLAIRES",
      montant: 258.83,
      date: new Date("2025-09-04"),
      description: "Taxe scolaire 2025-2026 — Versement 1 · 1671-1675 Hébert (CSS Laval · compte 00054937)",
      fournisseur: "Centre de services scolaire de Laval",
      methodePaiement: "VIREMENT",
      recurrent: false,
      createdAt: new Date("2025-09-04"),
      updatedAt: new Date("2025-09-04"),
    },
    {
      id: "tx_taxes_sco_lav_2025_v2",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "TAXES_SCOLAIRES",
      montant: 258.82,
      date: new Date("2025-11-06"),
      description: "Taxe scolaire 2025-2026 — Versement 2 · 1671-1675 Hébert (CSS Laval · compte 00054937)",
      fournisseur: "Centre de services scolaire de Laval",
      methodePaiement: "VIREMENT",
      recurrent: false,
      createdAt: new Date("2025-11-06"),
      updatedAt: new Date("2025-11-06"),
    },
    // ── Facture Home Depot — toilette + calfeutrage (2026-03-19) ──
    {
      id: "tx_homedepot_toilette_2026",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "REPARATION",
      montant: 232.04,
      date: new Date("2026-03-19"),
      description: "Home Depot — Toilette Glacier Bay 6L + scellant silicone + outils calfeutrage (cmd #0241069918)",
      fournisseur: "Home Depot Canada",
      methodePaiement: "VIREMENT",
      recurrent: false,
      notes: "Toilette 99,00 $ + silicone 6,87 $ + trousse 9,97 $ + pistolet 25,97 $ + livraison 60 $ + TPS/TVQ 30,23 $ = 232,04 $. Livré 1671 Hébert, Laval.",
      recuUrl: "/Rent/Factures 2026/Confirmation de commande _ Home Depot Canada Facture toilette et autre 2026.pdf",
      createdAt: new Date("2026-03-19"),
      updatedAt: new Date("2026-03-19"),
    },
    {
      id: "tx_notaire_lav_refin",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE",
      categorie: "AUTRE",
      montant: 2047,
      date: new Date("2025-12-15"),
      description: "Honoraires notariales refinancement — Me Olga Tanasov (2 047 $)",
      fournisseur: "Me Olga Tanasov",
      methodePaiement: "CHEQUE",
      recurrent: false,
      notes: "Frais notaire + publication · refinancement First National #1386552",
      createdAt: new Date("2025-12-15"),
      updatedAt: new Date("2025-12-15"),
    },
    // ── Taxes municipales — arrérage 2024 ──
    {
      id: "tx_taxes_mun_lav_arrerage_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "TAXES_MUNICIPALES",
      montant: 93.93,
      date: new Date("2025-02-17"),
      description: "Taxes foncières — arrérage 2024 · 1671-1675 Hébert (Ville de Laval)",
      fournisseur: "Ville de Laval",
      methodePaiement: "VIREMENT",
      recurrent: false,
      createdAt: new Date("2025-02-17"),
      updatedAt: new Date("2025-02-17"),
    },
    // ── Canadian Tire / Stelpro ──
    {
      id: "tx_stelpro_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "REPARATION",
      montant: 45.63,
      date: new Date("2025-02-21"),
      description: "Canadian Tire — Stelpro (pièces chauffage électrique)",
      fournisseur: "Canadian Tire",
      methodePaiement: "COMPTANT",
      recurrent: false,
      createdAt: new Date("2025-02-21"),
      updatedAt: new Date("2025-02-21"),
    },
    // ── Compteur électrique sous-sol — capital ──
    {
      id: "tx_compteur_elec_lav_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_CAPITAL",
      categorie: "RENOVATION",
      montant: 1954,
      date: new Date("2025-04-26"),
      description: "Installation compteur électrique sous-sol — 1671-1675 Hébert",
      fournisseur: "Électricien",
      methodePaiement: "CHEQUE",
      recurrent: false,
      notes: "Amélioration capital — non déductible en opération",
      createdAt: new Date("2025-04-26"),
      updatedAt: new Date("2025-04-26"),
    },
    // ── Thermopompe — capital ──
    {
      id: "tx_thermopompe_lav_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_CAPITAL",
      categorie: "RENOVATION",
      montant: 3500,
      date: new Date("2025-04-28"),
      description: "Thermopompe — 1671-1675 Hébert (fourniture + installation)",
      fournisseur: "Entrepreneur CVC",
      methodePaiement: "CHEQUE",
      recurrent: false,
      notes: "Amélioration capital",
      createdAt: new Date("2025-04-28"),
      updatedAt: new Date("2025-04-28"),
    },
    // ── Canadian Tire — Dewalt ──
    {
      id: "tx_ct_dewalt_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "REPARATION",
      montant: 149.46,
      date: new Date("2025-05-23"),
      description: "Canadian Tire — Dewalt (outils/matériaux entretien)",
      fournisseur: "Canadian Tire",
      methodePaiement: "COMPTANT",
      recurrent: false,
      createdAt: new Date("2025-05-23"),
      updatedAt: new Date("2025-05-23"),
    },
    // ── Canadian Tire mai 2025 ──
    {
      id: "tx_ct_mai_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "REPARATION",
      montant: 104.70,
      date: new Date("2025-05-31"),
      description: "Canadian Tire — matériaux entretien (mai 2025)",
      fournisseur: "Canadian Tire",
      methodePaiement: "COMPTANT",
      recurrent: false,
      createdAt: new Date("2025-05-31"),
      updatedAt: new Date("2025-05-31"),
    },
    // ── Uniprix — bail ──
    {
      id: "tx_uniprix_bail_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "GESTION",
      montant: 4.58,
      date: new Date("2025-06-30"),
      description: "Uniprix — impression bail locataire",
      fournisseur: "Uniprix",
      methodePaiement: "COMPTANT",
      recurrent: false,
      createdAt: new Date("2025-06-30"),
      updatedAt: new Date("2025-06-30"),
    },
    // ── Peinture ──
    {
      id: "tx_peinture_lav_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "REPARATION",
      montant: 500,
      date: new Date("2025-07-01"),
      description: "Peinture — travaux intérieurs (estimation)",
      methodePaiement: "COMPTANT",
      recurrent: false,
      notes: "Montant approximatif",
      createdAt: new Date("2025-07-01"),
      updatedAt: new Date("2025-07-01"),
    },
    // ── Home Depot — divers août 2025 ──
    {
      id: "tx_homedepot_aout_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "REPARATION",
      montant: 279.49,
      date: new Date("2025-08-17"),
      description: "Home Depot — matériaux entretien divers (août 2025)",
      fournisseur: "Home Depot Canada",
      methodePaiement: "COMPTANT",
      recurrent: false,
      createdAt: new Date("2025-08-17"),
      updatedAt: new Date("2025-08-17"),
    },
    // ── Canadian Tire — septembre 2025 ──
    {
      id: "tx_ct_sept_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "REPARATION",
      montant: 100.54,
      date: new Date("2025-09-05"),
      description: "Canadian Tire — matériaux entretien (sept 2025)",
      fournisseur: "Canadian Tire",
      methodePaiement: "COMPTANT",
      recurrent: false,
      createdAt: new Date("2025-09-05"),
      updatedAt: new Date("2025-09-05"),
    },
    // ── Assurance habitation Triplex Laval (2 604 $/an) ──
    {
      id: "tx_assurance_lav_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "ASSURANCE",
      montant: 2604,
      date: new Date("2025-01-01"),
      description: "Assurance habitation annuelle — Triplex Laval (2 604 $/an)",
      fournisseur: "Assureur",
      methodePaiement: "PRELEVEMENT",
      recurrent: true,
      notes: "≈ 217 $/mois",
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    },
    // ── Hydro-Québec (févr–déc 2025 — 2 004,25 $) ──
    {
      id: "tx_hydro_lav_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "ELECTRICITE",
      montant: 2004.25,
      date: new Date("2025-12-31"),
      description: "Hydro-Québec — consommation annuelle 2025 (févr–déc) · 1671-1675 Hébert",
      fournisseur: "Hydro-Québec",
      methodePaiement: "PRELEVEMENT",
      recurrent: false,
      notes: "Montant annuel cumulé 2025",
      createdAt: new Date("2025-12-31"),
      updatedAt: new Date("2025-12-31"),
    },
    // ── Hydro-Solution (location chauffe-eau — 398,94 $/an) ──
    {
      id: "tx_hydrosol_lav_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "AUTRE",
      montant: 398.94,
      date: new Date("2025-12-31"),
      description: "Hydro-Solution — location chauffe-eau annuelle 2025 (398,94 $/an)",
      fournisseur: "Hydro-Solution",
      methodePaiement: "PRELEVEMENT",
      recurrent: true,
      notes: "≈ 33,25 $/mois",
      createdAt: new Date("2025-12-31"),
      updatedAt: new Date("2025-12-31"),
    },
    // ── Kijiji — publicité location ──
    {
      id: "tx_kijiji_pub_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "GESTION",
      montant: 16.04,
      date: new Date("2025-12-14"),
      description: "Kijiji — publicité annonce location",
      fournisseur: "Kijiji",
      methodePaiement: "COMPTANT",
      recurrent: false,
      createdAt: new Date("2025-12-14"),
      updatedAt: new Date("2025-12-14"),
    },
    // ── Facebook — publicité location ──
    {
      id: "tx_facebook_pub_2025",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE_EXPLOITATION",
      categorie: "GESTION",
      montant: 55.10,
      date: new Date("2025-12-31"),
      description: "Facebook Ads — publicité location",
      fournisseur: "Meta",
      methodePaiement: "COMPTANT",
      recurrent: false,
      createdAt: new Date("2025-12-31"),
      updatedAt: new Date("2025-12-31"),
    },
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
    // Duplex Anjou — acquisition (écriture bilancielle, montant = 0 pour ne pas fausser le P&L)
    {
      id: "tx_achat_anjou",
      immeubleId: "imm_duplex_anjou",
      type: "ACQUISITION",
      categorie: "AUTRE",
      montant: 0,
      date: new Date("2026-03-20"),
      description: "Achat — 8450-8452 av. Sublaines, Anjou (Centris 10602915)",
      fournisseur: "Notaire",
      methodePaiement: "VIREMENT",
      recurrent: false,
      notes: "Prix d'achat : 829 000 $",
      miseDesFonds: 165800,       // ~20 %
      montantHypotheque: 663200,  // ~80 %
      fraisClosing: 12000,
      createdAt: new Date("2026-03-20"),
      updatedAt: new Date("2026-03-20"),
    },
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
  // 🔴 URGENTS — Rapport BatiXpert 26 sept. 2023
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
