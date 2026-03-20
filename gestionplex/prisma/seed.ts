/**
 * Seed GestionPlex — Données de démonstration
 * npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  // ─── Triplex Rosemont ────────────────────────────────────────────────────
  const triplex = await prisma.immeuble.create({
    data: {
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
    },
  });

  const logRDC = await prisma.logement.create({
    data: {
      immeubleId: triplex.id,
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
      notes: "4½ rénové. Belle luminosité côté cour.",
    },
  });

  const log1er = await prisma.logement.create({
    data: {
      immeubleId: triplex.id,
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
      notes: "5½. Grand balcon avant.",
    },
  });

  const log2e = await prisma.logement.create({
    data: {
      immeubleId: triplex.id,
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
      notes: "4½. Vue sur le parc Rosemont.",
    },
  });

  // ─── Locataires Triplex ───────────────────────────────────────────────────
  const loc1 = await prisma.locataire.create({
    data: {
      logementId: logRDC.id,
      prenom: "Marie-Claude",
      nom: "Tremblay",
      email: "mc.tremblay@gmail.com",
      telephone: "514-555-2341",
      telephoneUrgence: "514-555-8901",
      dateNaissance: new Date("1985-07-12"),
      statut: "ACTIF",
      notes: "Très bon payeur. Travaille comme infirmière.",
    },
  });

  const loc2 = await prisma.locataire.create({
    data: {
      logementId: log1er.id,
      prenom: "Jean-Philippe",
      nom: "Gagnon",
      email: "jp.gagnon@outlook.com",
      telephone: "438-555-7823",
      telephoneUrgence: "514-555-3344",
      dateNaissance: new Date("1990-03-25"),
      statut: "ACTIF",
      notes: "Famille avec 2 enfants. Toujours paye par virement.",
    },
  });

  const loc3 = await prisma.locataire.create({
    data: {
      logementId: log2e.id,
      prenom: "Fatima",
      nom: "Benali",
      email: "f.benali@hotmail.com",
      telephone: "514-555-6612",
      telephoneUrgence: "514-555-9901",
      dateNaissance: new Date("1993-11-08"),
      statut: "ACTIF",
      notes: "Étudiante à l'UQAM. Paiement automatique.",
    },
  });

  // ─── Baux Triplex ─────────────────────────────────────────────────────────
  await prisma.bail.create({
    data: {
      logementId: logRDC.id,
      locataireId: loc1.id,
      dateDebut: new Date("2023-07-01"),
      dateFin: new Date("2024-06-30"),
      loyerMensuel: 1200,
      statut: "ACTIF",
      augmentationAnnuelle: 0.9,
      clausesSpeciales: "Animaux autorisés (1 chat maximum).",
    },
  });

  await prisma.bail.create({
    data: {
      logementId: log1er.id,
      locataireId: loc2.id,
      dateDebut: new Date("2023-09-01"),
      dateFin: new Date("2024-08-31"),
      loyerMensuel: 1400,
      statut: "ACTIF",
      augmentationAnnuelle: 0.9,
    },
  });

  await prisma.bail.create({
    data: {
      logementId: log2e.id,
      locataireId: loc3.id,
      dateDebut: new Date("2023-09-01"),
      dateFin: new Date("2024-08-31"),
      loyerMensuel: 1250,
      statut: "ACTIF",
      augmentationAnnuelle: 0.9,
    },
  });

  // ─── Duplex Villeray ──────────────────────────────────────────────────────
  const duplex = await prisma.immeuble.create({
    data: {
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
      notes: "Rénovation de la cuisine du haut en cours.",
    },
  });

  const logBas = await prisma.logement.create({
    data: {
      immeubleId: duplex.id,
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
      notes: "5½. Locataire stable depuis 3 ans.",
    },
  });

  const logHaut = await prisma.logement.create({
    data: {
      immeubleId: duplex.id,
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
      notes: "4½. Rénovation cuisine et salle de bain. Disponible avril 2024.",
    },
  });

  const loc4 = await prisma.locataire.create({
    data: {
      logementId: logBas.id,
      prenom: "Roberto",
      nom: "Esposito",
      email: "r.esposito@gmail.com",
      telephone: "514-555-4421",
      telephoneUrgence: "514-555-6677",
      dateNaissance: new Date("1978-05-30"),
      statut: "ACTIF",
      notes: "Mécanicien. Locataire depuis 2021. Très respectueux.",
    },
  });

  await prisma.bail.create({
    data: {
      logementId: logBas.id,
      locataireId: loc4.id,
      dateDebut: new Date("2023-05-01"),
      dateFin: new Date("2024-04-30"),
      loyerMensuel: 1350,
      statut: "EN_RENOUVELLEMENT",
      augmentationAnnuelle: 0.9,
    },
  });

  // ─── Transactions (6 derniers mois) ───────────────────────────────────────
  const maintenant = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);

    // Loyers triplex
    await prisma.transaction.createMany({
      data: [
        {
          immeubleId: triplex.id,
          logementId: logRDC.id,
          type: "REVENU",
          categorie: "LOYER",
          montant: 1200,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — Rez-de-chaussée",
          methodePaiement: "VIREMENT",
          recurrent: true,
          recurrenceJour: 1,
        },
        {
          immeubleId: triplex.id,
          logementId: log1er.id,
          type: "REVENU",
          categorie: "LOYER",
          montant: 1400,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — 1er étage",
          methodePaiement: "VIREMENT",
          recurrent: true,
          recurrenceJour: 1,
        },
        {
          immeubleId: triplex.id,
          logementId: log2e.id,
          type: "REVENU",
          categorie: "LOYER",
          montant: 1250,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — 2e étage",
          methodePaiement: "PRELEVEMENT",
          recurrent: true,
          recurrenceJour: 1,
        },
        {
          immeubleId: duplex.id,
          logementId: logBas.id,
          type: "REVENU",
          categorie: "LOYER",
          montant: 1350,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          description: "Loyer — Bas-duplex",
          methodePaiement: "VIREMENT",
          recurrent: true,
          recurrenceJour: 1,
        },
        {
          immeubleId: triplex.id,
          type: "DEPENSE",
          categorie: "HYPOTHEQUE",
          montant: 2850,
          date: new Date(date.getFullYear(), date.getMonth(), 5),
          description: "Hypothèque — Triplex Rosemont",
          methodePaiement: "PRELEVEMENT",
          recurrent: true,
          recurrenceJour: 5,
        },
        {
          immeubleId: duplex.id,
          type: "DEPENSE",
          categorie: "HYPOTHEQUE",
          montant: 2100,
          date: new Date(date.getFullYear(), date.getMonth(), 5),
          description: "Hypothèque — Duplex Villeray",
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
        categorie: "ASSURANCE",
        montant: 1850,
        date: new Date(maintenant.getFullYear(), 0, 15),
        description: "Assurance habitation — Triplex Rosemont",
        fournisseur: "Intact Assurance",
        methodePaiement: "CHEQUE",
      },
      {
        immeubleId: triplex.id,
        type: "DEPENSE",
        categorie: "TAXES_MUNICIPALES",
        montant: 4200,
        date: new Date(maintenant.getFullYear(), 0, 31),
        description: "Taxes municipales 2024",
        fournisseur: "Ville de Montréal",
        methodePaiement: "PRELEVEMENT",
      },
      {
        immeubleId: triplex.id,
        logementId: logRDC.id,
        type: "DEPENSE",
        categorie: "REPARATION",
        montant: 385,
        date: new Date(maintenant.getFullYear(), maintenant.getMonth() - 2, 12),
        description: "Réparation robinet — Rez-de-chaussée",
        fournisseur: "Plomberie Lavoie Inc.",
        methodePaiement: "CHEQUE",
      },
      {
        immeubleId: triplex.id,
        type: "DEPENSE",
        categorie: "DENEIGEMENT",
        montant: 750,
        date: new Date(maintenant.getFullYear() - 1, 10, 1),
        description: "Contrat de déneigement — Hiver 2023-2024",
        fournisseur: "Neige Express MTL",
        methodePaiement: "CHEQUE",
      },
      {
        immeubleId: duplex.id,
        logementId: logHaut.id,
        type: "DEPENSE",
        categorie: "RENOVATION",
        montant: 8500,
        date: new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 20),
        description: "Rénovation cuisine — Haut-duplex",
        fournisseur: "Construction Leblanc",
        methodePaiement: "VIREMENT",
        notes: "Acompte 50%. Solde à la livraison.",
      },
      {
        immeubleId: duplex.id,
        type: "DEPENSE",
        categorie: "ASSURANCE",
        montant: 1450,
        date: new Date(maintenant.getFullYear(), 2, 22),
        description: "Assurance — Duplex Villeray",
        fournisseur: "Desjardins Assurance",
        methodePaiement: "PRELEVEMENT",
      },
    ],
  });

  // ─── Demandes d'entretien ─────────────────────────────────────────────────
  await prisma.demandeEntretien.createMany({
    data: [
      {
        logementId: logRDC.id,
        locataireId: loc1.id,
        titre: "Fuite sous l'évier de cuisine",
        description: "Petite fuite au niveau du siphon. Tache d'humidité dans l'armoire.",
        priorite: "HAUTE",
        statut: "TERMINEE",
        categorie: "PLOMBERIE",
        dateOuverture: new Date("2024-01-08"),
        dateFermeture: new Date("2024-01-12"),
        cout: 385,
        fournisseurAssigne: "Plomberie Lavoie Inc.",
        notes: "Siphon remplacé. Joint refait.",
      },
      {
        logementId: log1er.id,
        locataireId: loc2.id,
        titre: "Radiateur qui fait du bruit",
        description: "Le radiateur du salon claque la nuit. Chauffage moins efficace.",
        priorite: "NORMALE",
        statut: "EN_COURS",
        categorie: "CHAUFFAGE",
        dateOuverture: new Date("2024-02-03"),
        fournisseurAssigne: "Chauffage Confort Plus",
        notes: "Purgeur à remplacer. Pièce commandée.",
      },
      {
        logementId: logHaut.id,
        titre: "Rénovation cuisine — travaux en cours",
        description: "Rénovation complète de la cuisine. Armoires, comptoir et plancher.",
        priorite: "NORMALE",
        statut: "EN_COURS",
        categorie: "AUTRE",
        dateOuverture: new Date("2024-02-01"),
        fournisseurAssigne: "Construction Leblanc",
        cout: 17000,
        notes: "Livraison prévue fin mars 2024.",
      },
      {
        logementId: log2e.id,
        locataireId: loc3.id,
        titre: "Ampoules grillées — salle de bain",
        description: "3 ampoules grillées dans le plafonnier.",
        priorite: "BASSE",
        statut: "NOUVELLE",
        categorie: "ELECTRICITE",
        dateOuverture: new Date("2024-02-15"),
      },
    ],
  });

  // ─── Rappels ──────────────────────────────────────────────────────────────
  await prisma.rappel.createMany({
    data: [
      {
        titre: "Renouvellement bail — Tremblay (RDC Rosemont)",
        description: "Envoyer l'avis de renouvellement 3 mois avant la fin du bail",
        date: new Date("2024-03-31"),
        statut: "ACTIF",
        immeubleId: triplex.id,
      },
      {
        titre: "Inspection annuelle — Triplex Rosemont",
        description: "Inspection de routine : toit, fondations, systèmes mécaniques",
        date: new Date("2024-05-15"),
        recurrent: true,
        frequence: "ANNUEL",
        statut: "ACTIF",
        immeubleId: triplex.id,
      },
      {
        titre: "Paiement taxes scolaires",
        description: "Taxes scolaires à payer avant le 15 août",
        date: new Date("2024-07-31"),
        recurrent: true,
        frequence: "ANNUEL",
        statut: "ACTIF",
        immeubleId: triplex.id,
      },
    ],
  });

  console.log("✅ Seed terminé avec succès!");
  console.log("  - 2 immeubles créés (Triplex Rosemont, Duplex Villeray)");
  console.log("  - 5 logements créés");
  console.log("  - 4 locataires créés");
  console.log("  - 4 baux créés");
  console.log("  - Transactions des 6 derniers mois");
  console.log("  - 4 demandes d'entretien");
  console.log("  - 3 rappels");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
