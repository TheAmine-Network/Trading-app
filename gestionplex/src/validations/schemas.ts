import { z } from "zod";

// ─── Schéma Transaction ───
export const transactionSchema = z.object({
  immeubleId: z.string().min(1, "L'immeuble est requis"),
  logementId: z.string().optional(),
  type: z.enum(["REVENU", "DEPENSE"]),
  categorie: z.enum([
    "LOYER", "STATIONNEMENT", "BUANDERIE", "REPARATION", "ASSURANCE",
    "TAXES_MUNICIPALES", "TAXES_SCOLAIRES", "HYPOTHEQUE", "DENEIGEMENT",
    "ENTRETIEN", "RENOVATION", "ELECTRICITE", "GAZ", "AUTRE",
  ]),
  montant: z.number().positive("Le montant doit être positif"),
  date: z.string().min(1, "La date est requise"),
  description: z.string().min(1, "La description est requise"),
  fournisseur: z.string().optional(),
  methodePaiement: z.enum(["VIREMENT", "CHEQUE", "COMPTANT", "PRELEVEMENT"]).optional(),
  recurrent: z.boolean().default(false),
  recurrenceJour: z.number().int().min(1).max(31).optional(),
  notes: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

// ─── Schéma Demande d'entretien ───
export const demandeEntretienSchema = z.object({
  logementId: z.string().min(1, "Le logement est requis"),
  locataireId: z.string().optional(),
  titre: z.string().min(1, "Le titre est requis").max(100),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  priorite: z.enum(["URGENTE", "HAUTE", "NORMALE", "BASSE"]),
  categorie: z.enum([
    "PLOMBERIE", "ELECTRICITE", "CHAUFFAGE", "STRUCTURE",
    "APPAREILS", "PEINTURE", "EXTERIEUR", "AUTRE",
  ]),
  fournisseurAssigne: z.string().optional(),
  notes: z.string().optional(),
});

export type DemandeEntretienFormData = z.infer<typeof demandeEntretienSchema>;

// ─── Schéma Locataire ───
export const locataireSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Courriel invalide").optional().or(z.literal("")),
  telephone: z.string().optional(),
  telephoneUrgence: z.string().optional(),
  dateNaissance: z.string().optional(),
  logementId: z.string().optional(),
  notes: z.string().optional(),
});

export type LocataireFormData = z.infer<typeof locataireSchema>;

// ─── Schéma Bail ───
export const bailSchema = z.object({
  logementId: z.string().min(1, "Le logement est requis"),
  locataireId: z.string().min(1, "Le locataire est requis"),
  dateDebut: z.string().min(1, "La date de début est requise"),
  dateFin: z.string().min(1, "La date de fin est requise"),
  loyerMensuel: z.number().positive("Le loyer doit être positif"),
  depot: z.number().optional(),
  clausesSpeciales: z.string().optional(),
  augmentationAnnuelle: z.number().min(0).max(100).optional(),
  sectionG: z.boolean().default(false),
});

export type BailFormData = z.infer<typeof bailSchema>;

// ─── Schéma Rappel ───
export const rappelSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  recurrent: z.boolean().default(false),
  frequence: z.enum(["QUOTIDIEN", "HEBDOMADAIRE", "MENSUEL", "ANNUEL"]).optional(),
  immeubleId: z.string().optional(),
  bailId: z.string().optional(),
});

export type RappelFormData = z.infer<typeof rappelSchema>;
