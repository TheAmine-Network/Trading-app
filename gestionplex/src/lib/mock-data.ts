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
    dateAchat: new Date("2023-10-01"),
    prixAchat: 749000,
    valeurMunicipale: 571300,
    numeroLot: "Centris #21607760",
    notes:
      "Triplex acheté oct. 2023. Refinancé déc. 2025 (First National #1386552). " +
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
  // ── Triplex Laval — 1671 ──
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
  // ── Triplex Laval — 1675 ──
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
      "Robinetterie lavabo mal fixée.",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2026-01-01"),
  },
  // ── Triplex Laval — 1671A ──
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
];

// ─── BAUX ────────────────────────────────────────────────────────────────────

export const baux: Bail[] = [
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

  // Loyers Triplex Laval — 6 derniers mois
  for (let i = 5; i >= 0; i--) {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
    transactions.push(
      {
        id: `tx_loyer_lav_1671_${i}`,
        immeubleId: "imm_triplex_laval",
        logementId: "log_lav_1671",
        type: "REVENU",
        categorie: "LOYER",
        montant: 1200,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: "Loyer — 1671 (Linda Bouchard)",
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
        montant: 950,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: "Loyer — 1675 (Kevin Ouellet)",
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
        montant: 1150,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        description: "Loyer — 1671A (Nadia Perreault)",
        methodePaiement: "PRELEVEMENT",
        recurrent: true,
        recurrenceJour: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: `tx_hyp_lav_${i}`,
        immeubleId: "imm_triplex_laval",
        type: "DEPENSE",
        categorie: "HYPOTHEQUE",
        montant: 3850,
        date: new Date(date.getFullYear(), date.getMonth(), 5),
        description: "Hypothèque First National #1386552 — Triplex Laval",
        methodePaiement: "PRELEVEMENT",
        recurrent: true,
        recurrenceJour: 5,
        createdAt: date,
        updatedAt: date,
      }
    );
  }

  // Dépenses ponctuelles Laval
  transactions.push(
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
    {
      id: "tx_notaire_lav_refin",
      immeubleId: "imm_triplex_laval",
      type: "DEPENSE",
      categorie: "AUTRE",
      montant: 1860,
      date: new Date("2025-12-15"),
      description: "Honoraires notariales refinancement — Me Olga Tanasov (1 860 $)",
      fournisseur: "Me Olga Tanasov",
      methodePaiement: "CHEQUE",
      recurrent: false,
      notes: "1 250 $ + taxes + 610 $ frais de publication",
      createdAt: new Date("2025-12-15"),
      updatedAt: new Date("2025-12-15"),
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
