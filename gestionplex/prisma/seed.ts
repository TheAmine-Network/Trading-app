/**
 * Seed GestionPlex — Données réelles du portefeuille
 * npx prisma db seed
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("🌱 Début du seed GestionPlex...");

  // ─── Nettoyage ────────────────────────────────────────────────────────────
  await prisma.transaction.deleteMany();
  await prisma.demandeEntretien.deleteMany();
  await prisma.rappel.deleteMany();
  await prisma.document.deleteMany();
  await prisma.bail.deleteMany();
  await prisma.locataire.deleteMany();
  await prisma.logement.deleteMany();
  await prisma.immeuble.deleteMany();

  // ─── Triplex Laval — Hébert ───────────────────────────────────────────────
  const triplex = await prisma.immeuble.create({
    data: {
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
    },
  });

  const log1671 = await prisma.logement.create({
    data: {
      immeubleId: triplex.id,
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
      notes:
        "5 pièces. Bail reconduit. " +
        "Plafond avec cernes d'eau. Panneau 100A PLEIN — hotte cuisine sans couvercle. " +
        "Moustiquaire cuisine endommagée.",
    },
  });

  const log1675 = await prisma.logement.create({
    data: {
      immeubleId: triplex.id,
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
      notes:
        "5 pièces. Bail reconduit. " +
        "Prises élec. cuisine non fonctionnelles. Panneau 100A PLEIN, disjoncteurs non identifiés. " +
        "Plafonds avec cernes d'eau. Portes intérieures endommagées.",
    },
  });

  const log1671a = await prisma.logement.create({
    data: {
      immeubleId: triplex.id,
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
      notes:
        "4 pièces. Bail en renouvellement. " +
        "DANGER: panneau élec. 200A — ouvertures non obturées (maître électricien urgent). " +
        "Fenêtre avant: infiltration d'eau + moisissures. " +
        "Chauffe-eau remplacé sept. 2025 (HydroSolution).",
    },
  });

  // ─── Locataires Triplex ───────────────────────────────────────────────────
  const loc1 = await prisma.locataire.create({
    data: {
      logementId: log1671.id,
      prenom: "Linda",
      nom: "Bouchard",
      email: "linda.bouchard@gmail.com",
      telephone: "450-555-3412",
      statut: "ACTIF",
      notes: "Locataire depuis 2021. Bail renouvelé 2024. Loyer 1 200 $/mois.",
    },
  });

  const loc2 = await prisma.locataire.create({
    data: {
      logementId: log1675.id,
      prenom: "Kevin",
      nom: "Ouellet",
      email: "k.ouellet@outlook.com",
      telephone: "450-555-8820",
      statut: "ACTIF",
      notes: "Locataire depuis 2022. Loyer 950 $/mois.",
    },
  });

  const loc3 = await prisma.locataire.create({
    data: {
      logementId: log1671a.id,
      prenom: "Nadia",
      nom: "Perreault",
      email: "nadia.perreault@hotmail.com",
      telephone: "450-555-6671",
      statut: "ACTIF",
      notes: "Locataire depuis 2020. Loyer 1 150 $/mois.",
    },
  });

  // ─── Baux Triplex ─────────────────────────────────────────────────────────
  await prisma.bail.create({
    data: {
      logementId: log1671.id,
      locataireId: loc1.id,
      dateDebut: new Date("2024-07-01"),
      dateFin: new Date("2025-06-30"),
      loyerMensuel: 1200,
      statut: "EXPIRE",
      augmentationAnnuelle: 0.9,
      clausesSpeciales: "Bail expiré 2024-06-30. Reconduit tacitement.",
    },
  });

  await prisma.bail.create({
    data: {
      logementId: log1675.id,
      locataireId: loc2.id,
      dateDebut: new Date("2024-07-01"),
      dateFin: new Date("2025-06-30"),
      loyerMensuel: 950,
      statut: "EXPIRE",
      augmentationAnnuelle: 0.9,
      clausesSpeciales: "Électroménagers sous-sol inclus selon bail.",
    },
  });

  await prisma.bail.create({
    data: {
      logementId: log1671a.id,
      locataireId: loc3.id,
      dateDebut: new Date("2024-07-01"),
      dateFin: new Date("2025-06-30"),
      loyerMensuel: 1150,
      statut: "EN_RENOUVELLEMENT",
      augmentationAnnuelle: 0.9,
    },
  });

  // ─── Duplex Anjou — Sublaines ─────────────────────────────────────────────
  const duplex = await prisma.immeuble.create({
    data: {
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
        "Duplex jumelé acquis mars 2026. " +
        "8452 (haut) : vacant, en rénovation, valeur locative cible 2 750 $/mois. " +
        "8450 (bas) : habité par le propriétaire (Amine). " +
        "Assurance : 160 $/mois. Travaux : planchers, SDB, cuisines, élec, thermopompe.",
    },
  });

  await prisma.logement.create({
    data: {
      immeubleId: duplex.id,
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
      notes:
        "7 pièces, 4 chambres, 2 SDB, inst. lav/séch. Vacant. " +
        "Valeur locative cible: 2 750 $/mois. " +
        "Rénovations en cours : planchers, SDB, cuisine, mise à terre élec, sortie sécheuse.",
    },
  });

  await prisma.logement.create({
    data: {
      immeubleId: duplex.id,
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
      notes:
        "5 pièces, 3 chambres, 1 SDB, inst. lav/séch, garage chauffé intégré. " +
        "Habité par le propriétaire. Valeur locative: 2 250 $/mois.",
    },
  });

  // ─── Transactions (6 derniers mois) ───────────────────────────────────────
  const maintenant = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);

    await prisma.transaction.createMany({
      data: [
        {
          immeubleId: triplex.id,
          logementId: log1671.id,
          type: "REVENU",
          categorie: "LOYER",
          montant: 1200,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — 1671 (Linda Bouchard)",
          methodePaiement: "VIREMENT",
          recurrent: true,
          recurrenceJour: 1,
        },
        {
          immeubleId: triplex.id,
          logementId: log1675.id,
          type: "REVENU",
          categorie: "LOYER",
          montant: 950,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — 1675 (Kevin Ouellet)",
          methodePaiement: "VIREMENT",
          recurrent: true,
          recurrenceJour: 1,
        },
        {
          immeubleId: triplex.id,
          logementId: log1671a.id,
          type: "REVENU",
          categorie: "LOYER",
          montant: 1150,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — 1671A (Nadia Perreault)",
          methodePaiement: "PRELEVEMENT",
          recurrent: true,
          recurrenceJour: 1,
        },
        {
          immeubleId: triplex.id,
          type: "DEPENSE",
          categorie: "HYPOTHEQUE",
          montant: 3850,
          date: new Date(date.getFullYear(), date.getMonth(), 5),
          description: "Hypothèque First National #1386552 — Triplex Laval",
          methodePaiement: "PRELEVEMENT",
          recurrent: true,
          recurrenceJour: 5,
        },
      ],
    });
  }

  // Dépenses ponctuelles
  await prisma.transaction.createMany({
    data: [
      {
        immeubleId: triplex.id,
        type: "DEPENSE",
        categorie: "TAXES_MUNICIPALES",
        montant: 5043,
        date: new Date(maintenant.getFullYear(), 0, 31),
        description: "Taxes municipales — Triplex Laval Hébert",
        fournisseur: "Ville de Laval",
        methodePaiement: "PRELEVEMENT",
      },
      {
        immeubleId: triplex.id,
        type: "DEPENSE",
        categorie: "TAXES_SCOLAIRES",
        montant: 488,
        date: new Date(maintenant.getFullYear(), 7, 15),
        description: "Taxes scolaires — Triplex Laval",
        fournisseur: "CS des Samares",
        methodePaiement: "CHEQUE",
      },
      {
        immeubleId: triplex.id,
        type: "DEPENSE",
        categorie: "AUTRE",
        montant: 1860,
        date: new Date("2025-12-15"),
        description: "Honoraires notariales refinancement — Me Olga Tanasov",
        fournisseur: "Me Olga Tanasov",
        methodePaiement: "CHEQUE",
        notes: "1 250 $ + taxes + 610 $ frais de publication",
      },
      {
        immeubleId: triplex.id,
        logementId: log1671a.id,
        type: "DEPENSE",
        categorie: "REPARATION",
        montant: 1200,
        date: new Date("2025-09-15"),
        description: "Remplacement chauffe-eau 180L — 1671A (HydroSolution)",
        fournisseur: "HydroSolution",
        methodePaiement: "VIREMENT",
      },
      {
        immeubleId: duplex.id,
        type: "DEPENSE",
        categorie: "ASSURANCE",
        montant: 160,
        date: new Date(maintenant.getFullYear(), maintenant.getMonth(), 1),
        description: "Assurance habitation mensuelle — Duplex Anjou",
        fournisseur: "Intact Assurance",
        methodePaiement: "PRELEVEMENT",
        notes: "160 $/mois = 1 920 $/an",
      },
    ],
  });

  // ─── Demandes d'entretien ─────────────────────────────────────────────────
  await prisma.demandeEntretien.createMany({
    data: [
      {
        logementId: log1671a.id,
        locataireId: loc3.id,
        titre: "⚡ Panneau électrique 1671A — ouvertures non obturées",
        description:
          "Rapport BatiXpert (26 sept. 2023) : ouvertures non obturées panneau 200A. " +
          "DANGER IMMÉDIAT — maître électricien CMEQ requis.",
        priorite: "URGENTE",
        statut: "NOUVELLE",
        categorie: "ELECTRICITE",
        dateOuverture: new Date("2023-09-26"),
        notes: "Ne pas ignorer. Obligatoire pour maintenir l'assurabilité.",
      },
      {
        logementId: log1675.id,
        locataireId: loc2.id,
        titre: "⚡ Prises électriques cuisine 1675 — non fonctionnelles",
        description:
          "Rapport BatiXpert : prises cuisine 1675 non fonctionnelles. " +
          "Maître électricien requis pour diagnostic.",
        priorite: "URGENTE",
        statut: "NOUVELLE",
        categorie: "ELECTRICITE",
        dateOuverture: new Date("2023-09-26"),
      },
      {
        logementId: log1671.id,
        titre: "🚰 Valve d'eau principale — corrosion, ne pas opérer",
        description:
          "Rapport BatiXpert : valve principale avec rouille importante. " +
          "Ne pas opérer — risque de bris et inondation. Plombier requis.",
        priorite: "URGENTE",
        statut: "EN_COURS",
        categorie: "PLOMBERIE",
        dateOuverture: new Date("2023-09-26"),
        notes: "Risque majeur en cas d'urgence plomberie — prioriser avant l'hiver.",
      },
      {
        logementId: log1671a.id,
        locataireId: loc3.id,
        titre: "🪟 Fenêtre 1671A — infiltration eau + moisissures",
        description:
          "Rapport BatiXpert : infiltration d'eau fenêtre avant. " +
          "Moisissures et pourriture sur cadrage. Expert bâtiment requis.",
        priorite: "HAUTE",
        statut: "NOUVELLE",
        categorie: "STRUCTURE",
        dateOuverture: new Date("2023-09-26"),
      },
      {
        logementId: log1671a.id,
        locataireId: loc3.id,
        titre: "🌡️ Plinthes électriques 1671A — non fonctionnelles",
        description:
          "Rapport BatiXpert : plinthes électriques 1671A non fonctionnelles. " +
          "Locataire sans chauffage adéquat.",
        priorite: "HAUTE",
        statut: "NOUVELLE",
        categorie: "CHAUFFAGE",
        dateOuverture: new Date("2023-09-26"),
      },
    ],
  });

  // ─── Rappels ──────────────────────────────────────────────────────────────
  await prisma.rappel.createMany({
    data: [
      {
        titre: "Certificat de localisation — Hébert (2009, à mettre à jour)",
        description:
          "Certificat de 2009 — à mettre à jour avant vente ou refinancement. " +
          "Coût estimé : 800–1 500 $. Contacter un arpenteur-géomètre.",
        date: new Date("2026-06-01"),
        statut: "ACTIF",
        immeubleId: triplex.id,
      },
      {
        titre: "Renouvellement bail — 1671 (Linda Bouchard)",
        description: "Avis de renouvellement 90 jours avant expiration.",
        date: new Date("2026-04-01"),
        statut: "ACTIF",
        immeubleId: triplex.id,
      },
      {
        titre: "Renouvellement bail — 1675 (Kevin Ouellet)",
        description: "Avis de renouvellement 90 jours avant expiration.",
        date: new Date("2026-04-01"),
        statut: "ACTIF",
        immeubleId: triplex.id,
      },
      {
        titre: "Renouvellement bail — 1671A (Nadia Perreault)",
        description: "Bail en renouvellement — à confirmer avec locataire.",
        date: new Date("2026-04-01"),
        statut: "ACTIF",
        immeubleId: triplex.id,
      },
      {
        titre: "Taxes scolaires Laval — Paiement annuel",
        description: "Taxes scolaires 488 $ — CS des Samares, avant le 15 août.",
        date: new Date(new Date().getFullYear(), 7, 1),
        recurrent: true,
        frequence: "ANNUEL",
        statut: "ACTIF",
        immeubleId: triplex.id,
      },
      {
        titre: "Évaluation marchande — mise à jour annuelle",
        description:
          "Dernière évaluation : 849 000 $ (sept. 2025, RE/MAX du Cartier). " +
          "Mettre à jour annuellement.",
        date: new Date("2026-09-01"),
        recurrent: true,
        frequence: "ANNUEL",
        statut: "ACTIF",
        immeubleId: triplex.id,
      },
    ],
  });

  console.log("✅ Seed terminé avec succès!");
  console.log("  - 2 immeubles : Triplex Laval Hébert + Duplex Anjou Sublaines");
  console.log("  - 5 logements créés");
  console.log("  - 3 locataires créés");
  console.log("  - 3 baux créés");
  console.log("  - Transactions des 6 derniers mois");
  console.log("  - 5 demandes d'entretien");
  console.log("  - 6 rappels");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
