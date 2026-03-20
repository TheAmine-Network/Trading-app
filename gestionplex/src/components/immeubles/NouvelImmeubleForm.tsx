"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  DollarSign,
  Home,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
  Shield,
  Thermometer,
  Car,
  Wifi,
  Droplets,
  AlertTriangle,
  Calendar,
  Hash,
  Calculator,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Logement {
  numero: string;
  superficie: number;
  nbPieces: number;
  nbSallesBain: number;
  loyerMensuel: number;
  inclus: {
    chauffage: boolean;
    eauChaude: boolean;
    electricite: boolean;
    stationnement: boolean;
    internet: boolean;
    buanderie: boolean;
  };
  statut: "OCCUPE" | "VACANT" | "EN_RENOVATION";
  notes: string;
}

interface FormData {
  // Identification
  nom: string;
  centrisUrl: string;
  type: "DUPLEX" | "TRIPLEX" | "QUADRUPLEX" | "IMMEUBLE" | "MAISON" | "CONDO";
  adresse: string;
  ville: string;
  province: string;
  codePostal: string;
  numeroLot: string;
  matricule: string;

  // Financier
  dateAchat: string;
  prixAchat: number;
  valeurMunicipale: number;
  taxesMunicipales: number;
  taxesScolaires: number;
  assuranceAnnuelle: number;
  hypothequesMensuelles: number;
  tauxInteret: number;
  amortissementAns: number;

  // Construction
  anneeConstruct: number;
  superficieTotale: number;
  nbLogements: number;
  typeConstruction: string;
  fondation: string;
  toitType: string;
  toitAnnee: number;
  chaudiereAnnee: number;
  plomberieAnnee: number;
  electriciteAmperage: number;
  certificatLocalisation: boolean;
  inspectionAchat: boolean;

  // Logements
  logements: Logement[];

  // Notes
  notes: string;
  pointsAttention: string;
}

const ETAPES = [
  { id: "identification", label: "Identification", icone: Building2 },
  { id: "financier", label: "Financier", icone: DollarSign },
  { id: "construction", label: "Bâtiment", icone: Home },
  { id: "logements", label: "Logements", icone: Hash },
  { id: "notes", label: "Notes", icone: FileText },
];

const LOGEMENT_VIDE: Logement = {
  numero: "",
  superficie: 0,
  nbPieces: 3,
  nbSallesBain: 1,
  loyerMensuel: 0,
  inclus: {
    chauffage: false,
    eauChaude: false,
    electricite: false,
    stationnement: false,
    internet: false,
    buanderie: false,
  },
  statut: "VACANT",
  notes: "",
};

// ─── Composant principal ──────────────────────────────────────────────────────

export function NouvelImmeubleForm() {
  const [etapeActuelle, setEtapeActuelle] = useState(0);
  const [centrisLoading, setCentrisLoading] = useState(false);
  const [centrisExtracted, setCentrisExtracted] = useState(false);

  const [form, setForm] = useState<FormData>({
    nom: "",
    centrisUrl: "",
    type: "TRIPLEX",
    adresse: "",
    ville: "Montréal",
    province: "QC",
    codePostal: "",
    numeroLot: "",
    matricule: "",
    dateAchat: new Date().toISOString().split("T")[0],
    prixAchat: 0,
    valeurMunicipale: 0,
    taxesMunicipales: 0,
    taxesScolaires: 0,
    assuranceAnnuelle: 0,
    hypothequesMensuelles: 0,
    tauxInteret: 5.5,
    amortissementAns: 25,
    anneeConstruct: 1960,
    superficieTotale: 0,
    nbLogements: 2,
    typeConstruction: "Brique",
    fondation: "Béton",
    toitType: "Asphalte",
    toitAnnee: 2015,
    chaudiereAnnee: 2018,
    plomberieAnnee: 2010,
    electriciteAmperage: 200,
    certificatLocalisation: false,
    inspectionAchat: false,
    logements: [{ ...LOGEMENT_VIDE, numero: "Rez-de-chaussée" }],
    notes: "",
    pointsAttention: "",
  });

  function update(champ: keyof FormData, valeur: unknown) {
    setForm(prev => ({ ...prev, [champ]: valeur }));
  }

  function ajouterLogement() {
    const nums = ["Rez-de-chaussée", "1er étage", "2e étage", "3e étage", "Sous-sol", "Penthouse"];
    const existants = form.logements.map(l => l.numero);
    const prochain = nums.find(n => !existants.includes(n)) ?? `Logement ${form.logements.length + 1}`;
    setForm(prev => ({
      ...prev,
      logements: [...prev.logements, { ...LOGEMENT_VIDE, numero: prochain }],
    }));
  }

  function updateLogement(index: number, champ: keyof Logement, valeur: unknown) {
    const logs = [...form.logements];
    logs[index] = { ...logs[index], [champ]: valeur };
    setForm(prev => ({ ...prev, logements: logs }));
  }

  function updateLogementInclus(index: number, inclus: keyof Logement["inclus"], valeur: boolean) {
    const logs = [...form.logements];
    logs[index] = { ...logs[index], inclus: { ...logs[index].inclus, [inclus]: valeur } };
    setForm(prev => ({ ...prev, logements: logs }));
  }

  function supprimerLogement(index: number) {
    setForm(prev => ({
      ...prev,
      logements: prev.logements.filter((_, i) => i !== index),
    }));
  }

  // ─── Simulation extraction Centris ────────────────────────────────────────

  async function extraireCentris() {
    if (!form.centrisUrl.includes("centris.ca")) return;
    setCentrisLoading(true);

    // Simulation d'extraction (en prod, utiliser une API de scraping autorisée)
    await new Promise(r => setTimeout(r, 1800));

    // Données simulées extraites de Centris
    setForm(prev => ({
      ...prev,
      nom: "Triplex Laval — Hébert (Centris)",
      adresse: "1671-1675, rue Hébert",
      ville: "Laval (Chomedey)",
      codePostal: "H7V 3L6",
      type: "TRIPLEX",
      anneeConstruct: 1952,
      superficieTotale: 2400,
      prixAchat: 680000,
      valeurMunicipale: 742000,
      nbLogements: 3,
      logements: [
        { ...LOGEMENT_VIDE, numero: "Rez-de-chaussée", superficie: 850, loyerMensuel: 1450 },
        { ...LOGEMENT_VIDE, numero: "1er étage", superficie: 780, loyerMensuel: 1280 },
        { ...LOGEMENT_VIDE, numero: "2e étage", superficie: 720, loyerMensuel: 1150 },
      ],
    }));

    setCentrisLoading(false);
    setCentrisExtracted(true);
  }

  // ─── Calculs financiers ───────────────────────────────────────────────────

  const revenusBruts = form.logements.reduce((s, l) => s + l.loyerMensuel, 0) * 12;
  const chargesAnnuelles =
    form.taxesMunicipales +
    form.taxesScolaires +
    form.assuranceAnnuelle +
    form.hypothequesMensuelles * 12;
  const cashflowAnnuel = revenusBruts - chargesAnnuelles;
  const rendementBrut = form.prixAchat > 0 ? (revenusBruts / form.prixAchat) * 100 : 0;
  const multiplicateurRevenuBrut = revenusBruts > 0 ? form.prixAchat / revenusBruts : 0;

  const etapeInfo = ETAPES[etapeActuelle];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── En-tête ───────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 glass px-5 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/immeubles">
            <motion.button
              whileTap={{ scale: 0.88 }}
              className="flex h-9 w-9 items-center justify-center rounded-2xl"
              style={{ background: "var(--bg-tertiary)" }}
            >
              <ChevronLeft className="h-5 w-5" style={{ color: "var(--fg)" }} />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--fg)", letterSpacing: "-0.015em" }}>
              Nouvel immeuble
            </h1>
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
              Étape {etapeActuelle + 1} sur {ETAPES.length} — {etapeInfo.label}
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-3 flex gap-1">
          {ETAPES.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setEtapeActuelle(i)}
              className="flex-1 overflow-hidden rounded-full"
              style={{ height: "3px", background: "var(--bg-tertiary)" }}
            >
              {i <= etapeActuelle && (
                <motion.div
                  layoutId={`progress-${i}`}
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-brand)" }}
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenu par étape ────────────────────────────────────────── */}
      <div className="px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={etapeActuelle}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >

            {/* ── Étape 1 : Identification ─────────────────────────── */}
            {etapeActuelle === 0 && (
              <div className="space-y-5">
                <SectionHeader icone={LinkIcon} titre="Import depuis Centris" couleur="#ea4335" />

                {/* Centris URL */}
                <div className="space-y-2">
                  <label className="section-title">URL d'annonce Centris</label>
                  <div className="flex gap-2">
                    <input
                      className="input-base flex-1"
                      placeholder="https://www.centris.ca/fr/..."
                      value={form.centrisUrl}
                      onChange={e => update("centrisUrl", e.target.value)}
                    />
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={extraireCentris}
                      disabled={centrisLoading || !form.centrisUrl}
                      className="flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      style={{ background: "var(--gradient-brand)", minWidth: "80px" }}
                    >
                      {centrisLoading ? "..." : centrisExtracted ? "✓ Importé" : "Extraire"}
                    </motion.button>
                  </div>
                  {centrisExtracted && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs"
                      style={{ color: "var(--success)" }}
                    >
                      ✓ Données extraites automatiquement — vérifiez et complétez si nécessaire
                    </motion.p>
                  )}
                  <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                    Collez le lien d'annonce pour extraire automatiquement les infos de base
                  </p>
                </div>

                <div className="h-px" style={{ background: "var(--border)" }} />
                <SectionHeader icone={Building2} titre="Informations de base" />

                <InputField
                  label="Nom de l'immeuble"
                  placeholder="Ex: Triplex Laval — Hébert"
                  value={form.nom}
                  onChange={v => update("nom", v)}
                />

                <div className="space-y-2">
                  <label className="section-title">Type d'immeuble</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["DUPLEX", "TRIPLEX", "QUADRUPLEX", "IMMEUBLE", "MAISON", "CONDO"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => update("type", t)}
                        className="rounded-2xl py-2.5 text-xs font-semibold transition-all"
                        style={
                          form.type === t
                            ? { background: "var(--gradient-brand)", color: "white" }
                            : { background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--fg-secondary)" }
                        }
                      >
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <SectionHeader icone={MapPin} titre="Adresse" />
                <InputField
                  label="Adresse civique"
                  placeholder="4823, rue Beaubien Est"
                  value={form.adresse}
                  onChange={v => update("adresse", v)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Ville" placeholder="Montréal" value={form.ville} onChange={v => update("ville", v)} />
                  <InputField label="Code postal" placeholder="H1X 1H7" value={form.codePostal} onChange={v => update("codePostal", v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Numéro de lot" placeholder="1 476 234" value={form.numeroLot} onChange={v => update("numeroLot", v)} />
                  <InputField label="Matricule" placeholder="0000-00-0000-0-000-0000" value={form.matricule} onChange={v => update("matricule", v)} />
                </div>
              </div>
            )}

            {/* ── Étape 2 : Financier ──────────────────────────────── */}
            {etapeActuelle === 1 && (
              <div className="space-y-5">
                <SectionHeader icone={Calendar} titre="Acquisition" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="section-title">Date d'achat</label>
                    <input
                      type="date"
                      className="input-base"
                      value={form.dateAchat}
                      onChange={e => update("dateAchat", e.target.value)}
                    />
                  </div>
                  <InputNumberField label="Prix d'achat ($)" value={form.prixAchat} onChange={v => update("prixAchat", v)} />
                </div>
                <InputNumberField label="Valeur municipale ($)" value={form.valeurMunicipale} onChange={v => update("valeurMunicipale", v)} />

                <SectionHeader icone={Calculator} titre="Hypothèque" />
                <div className="grid grid-cols-2 gap-3">
                  <InputNumberField label="Paiement mensuel ($)" value={form.hypothequesMensuelles} onChange={v => update("hypothequesMensuelles", v)} />
                  <div className="space-y-1.5">
                    <label className="section-title">Taux d'intérêt (%)</label>
                    <input
                      type="number"
                      className="input-base"
                      step="0.05"
                      value={form.tauxInteret}
                      onChange={e => update("tauxInteret", parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <InputNumberField label="Amortissement (années)" value={form.amortissementAns} onChange={v => update("amortissementAns", v)} />

                <SectionHeader icone={DollarSign} titre="Charges annuelles" />
                <div className="grid grid-cols-2 gap-3">
                  <InputNumberField label="Taxes municipales ($)" value={form.taxesMunicipales} onChange={v => update("taxesMunicipales", v)} />
                  <InputNumberField label="Taxes scolaires ($)" value={form.taxesScolaires} onChange={v => update("taxesScolaires", v)} />
                  <InputNumberField label="Assurance ($)" value={form.assuranceAnnuelle} onChange={v => update("assuranceAnnuelle", v)} />
                </div>

                {/* Calculateur de rentabilité */}
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "var(--gradient-brand-subtle)", border: "1px solid var(--accent-muted)" }}
                >
                  <p className="section-title mb-3" style={{ color: "var(--accent)" }}>
                    Indicateurs de performance
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <MetriqueCard label="Revenus bruts/an" valeur={`${revenusBruts.toLocaleString("fr-CA")} $`} />
                    <MetriqueCard
                      label="Cashflow/an"
                      valeur={`${cashflowAnnuel.toLocaleString("fr-CA")} $`}
                      couleur={cashflowAnnuel >= 0 ? "var(--success)" : "var(--danger)"}
                    />
                    <MetriqueCard label="Rendement brut" valeur={`${rendementBrut.toFixed(2)} %`} />
                    <MetriqueCard label="MRB" valeur={multiplicateurRevenuBrut.toFixed(1)} info="Multiplicateur de revenus bruts (cible ≤ 15)" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Étape 3 : Bâtiment ──────────────────────────────── */}
            {etapeActuelle === 2 && (
              <div className="space-y-5">
                <SectionHeader icone={Home} titre="Caractéristiques physiques" />
                <div className="grid grid-cols-2 gap-3">
                  <InputNumberField label="Année de construction" value={form.anneeConstruct} onChange={v => update("anneeConstruct", v)} />
                  <InputNumberField label="Superficie totale (pi²)" value={form.superficieTotale} onChange={v => update("superficieTotale", v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="section-title">Type de construction</label>
                    <select
                      className="input-base"
                      value={form.typeConstruction}
                      onChange={e => update("typeConstruction", e.target.value)}
                    >
                      {["Brique", "Pierre", "Bois", "Stucco", "Aluminium", "Mixte"].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="section-title">Type de fondation</label>
                    <select
                      className="input-base"
                      value={form.fondation}
                      onChange={e => update("fondation", e.target.value)}
                    >
                      {["Béton", "Pierre", "Blocs", "Acier"].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <SectionHeader icone={AlertTriangle} titre="Éléments à dater" couleur="var(--warning)" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="section-title">Type de toit</label>
                    <select
                      className="input-base"
                      value={form.toitType}
                      onChange={e => update("toitType", e.target.value)}
                    >
                      {["Asphalte", "Bardeau", "Membrane", "Métal", "Gravier"].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <InputNumberField label="Toit refait (année)" value={form.toitAnnee} onChange={v => update("toitAnnee", v)} />
                  <InputNumberField label="Chaudière (année)" value={form.chaudiereAnnee} onChange={v => update("chaudiereAnnee", v)} />
                  <InputNumberField label="Plomberie rénovée" value={form.plomberieAnnee} onChange={v => update("plomberieAnnee", v)} />
                  <InputNumberField label="Électricité (ampérage)" value={form.electriciteAmperage} onChange={v => update("electriciteAmperage", v)} />
                </div>

                <SectionHeader icone={FileText} titre="Documents légaux" />
                <div className="space-y-2">
                  <ToggleField
                    label="Certificat de localisation valide"
                    description="Émis dans les 10 dernières années"
                    valeur={form.certificatLocalisation}
                    onChange={v => update("certificatLocalisation", v)}
                  />
                  <ToggleField
                    label="Inspection pré-achat effectuée"
                    description="Rapport disponible en documents"
                    valeur={form.inspectionAchat}
                    onChange={v => update("inspectionAchat", v)}
                  />
                </div>
              </div>
            )}

            {/* ── Étape 4 : Logements ──────────────────────────────── */}
            {etapeActuelle === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold" style={{ color: "var(--fg)" }}>
                    {form.logements.length} logement{form.logements.length > 1 ? "s" : ""}
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={ajouterLogement}
                    className="rounded-2xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    + Ajouter
                  </motion.button>
                </div>

                {form.logements.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card space-y-4 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-xl text-white text-xs font-bold"
                          style={{ background: "var(--gradient-brand)" }}
                        >
                          {i + 1}
                        </div>
                        <input
                          className="bg-transparent text-sm font-bold outline-none"
                          style={{ color: "var(--fg)" }}
                          value={log.numero}
                          onChange={e => updateLogement(i, "numero", e.target.value)}
                        />
                      </div>
                      {form.logements.length > 1 && (
                        <button
                          onClick={() => supprimerLogement(i)}
                          className="text-xs"
                          style={{ color: "var(--danger)" }}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="section-title">Statut</label>
                        <select
                          className="input-base text-sm"
                          value={log.statut}
                          onChange={e => updateLogement(i, "statut", e.target.value)}
                        >
                          <option value="OCCUPE">Occupé</option>
                          <option value="VACANT">Vacant</option>
                          <option value="EN_RENOVATION">En rénovation</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="section-title">Loyer mensuel ($)</label>
                        <input
                          type="number"
                          className="input-base text-sm"
                          value={log.loyerMensuel || ""}
                          onChange={e => updateLogement(i, "loyerMensuel", parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "nbPieces", label: "Pièces" },
                        { key: "nbSallesBain", label: "Sdb" },
                        { key: "superficie", label: "pi²" },
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                          <label className="section-title">{label}</label>
                          <input
                            type="number"
                            className="input-base text-sm"
                            value={(log[key as keyof Logement] as number) || ""}
                            onChange={e => updateLogement(i, key as keyof Logement, parseInt(e.target.value) || 0)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Inclusions */}
                    <div>
                      <p className="section-title mb-2">Inclus dans le loyer</p>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { key: "chauffage", label: "Chauffage", icone: Thermometer },
                          { key: "eauChaude", label: "Eau chaude", icone: Droplets },
                          { key: "electricite", label: "Électricité", icone: Zap },
                          { key: "stationnement", label: "Parking", icone: Car },
                          { key: "internet", label: "Internet", icone: Wifi },
                          { key: "buanderie", label: "Buanderie", icone: Shield },
                        ] as const).map(({ key, label, icone: Icone }) => {
                          const actif = log.inclus[key];
                          return (
                            <button
                              key={key}
                              onClick={() => updateLogementInclus(i, key, !actif)}
                              className="flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-all"
                              style={
                                actif
                                  ? { background: "var(--accent-muted)", color: "var(--accent)" }
                                  : { background: "var(--bg-secondary)", color: "var(--fg-muted)" }
                              }
                            >
                              <Icone className="h-4 w-4" />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="section-title">Notes</label>
                      <textarea
                        className="input-base resize-none text-sm"
                        rows={2}
                        placeholder="Rénovations récentes, particularités..."
                        value={log.notes}
                        onChange={e => updateLogement(i, "notes", e.target.value)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── Étape 5 : Notes ─────────────────────────────────── */}
            {etapeActuelle === 4 && (
              <div className="space-y-5">
                <SectionHeader icone={FileText} titre="Notes et observations" />
                <div className="space-y-1.5">
                  <label className="section-title">Notes générales</label>
                  <textarea
                    className="input-base resize-none"
                    rows={5}
                    placeholder="Historique de l'immeuble, travaux planifiés, contexte du quartier..."
                    value={form.notes}
                    onChange={e => update("notes", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="section-title" style={{ color: "var(--warning)" }}>
                    Points d'attention ⚠️
                  </label>
                  <textarea
                    className="input-base resize-none"
                    rows={4}
                    placeholder="Vices connus, litiges, travaux urgents, problèmes récurrents..."
                    value={form.pointsAttention}
                    onChange={e => update("pointsAttention", e.target.value)}
                  />
                </div>

                {/* Résumé final */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: "var(--gradient-hero)", color: "white" }}
                >
                  <p className="text-sm font-bold mb-3">Résumé de l'immeuble</p>
                  <div className="space-y-1 text-sm">
                    <p style={{ color: "rgba(255,255,255,0.8)" }}>📍 {form.adresse || "Adresse non définie"}</p>
                    <p style={{ color: "rgba(255,255,255,0.8)" }}>🏘️ {form.type} · {form.logements.length} logements</p>
                    <p style={{ color: "rgba(255,255,255,0.8)" }}>
                      💰 {form.prixAchat > 0 ? `${form.prixAchat.toLocaleString("fr-CA")} $` : "Prix non défini"}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.8)" }}>
                      📈 Revenus bruts : {revenusBruts.toLocaleString("fr-CA")} $/an
                    </p>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation entre étapes ──────────────────────────────────── */}
      <div
        className="fixed bottom-20 left-0 right-0 flex gap-3 px-5 py-3 glass"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {etapeActuelle > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setEtapeActuelle(e => e - 1)}
            className="flex h-12 items-center gap-2 rounded-2xl px-5 text-sm font-semibold"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--fg)" }}
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (etapeActuelle < ETAPES.length - 1) {
              setEtapeActuelle(e => e + 1);
            } else {
              alert("Immeuble enregistré ! (Connexion DB requise en production)");
            }
          }}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white"
          style={{ background: "var(--gradient-brand)" }}
        >
          {etapeActuelle === ETAPES.length - 1 ? (
            <>
              <Check className="h-5 w-5" />
              Enregistrer l'immeuble
            </>
          ) : (
            <>
              Continuer
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Composants UI réutilisables ──────────────────────────────────────────────

function SectionHeader({
  icone: Icone,
  titre,
  couleur = "var(--accent)",
}: {
  icone: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  titre: string;
  couleur?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icone className="h-4 w-4" style={{ color: couleur }} />
      <h3 className="text-sm font-bold" style={{ color: "var(--fg)" }}>
        {titre}
      </h3>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="section-title">{label}</label>
      <input
        className="input-base"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function InputNumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="section-title">{label}</label>
      <input
        type="number"
        className="input-base"
        value={value || ""}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        placeholder="0"
      />
    </div>
  );
}

function ToggleField({
  label,
  description,
  valeur,
  onChange,
}: {
  label: string;
  description?: string;
  valeur: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!valeur)}
      className="card flex w-full items-center justify-between px-4 py-3 text-left"
    >
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>{label}</p>
        {description && (
          <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{description}</p>
        )}
      </div>
      <div
        className="flex h-6 w-6 items-center justify-center rounded-full"
        style={{
          background: valeur ? "var(--success)" : "var(--bg-tertiary)",
        }}
      >
        {valeur && <Check className="h-3.5 w-3.5 text-white" />}
      </div>
    </button>
  );
}

function MetriqueCard({
  label,
  valeur,
  couleur,
  info,
}: {
  label: string;
  valeur: string;
  couleur?: string;
  info?: string;
}) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <p className="section-title">{label}</p>
      <p
        className="mt-1 text-lg font-bold tabular-nums"
        style={{ color: couleur ?? "var(--fg)", letterSpacing: "-0.02em" }}
      >
        {valeur}
      </p>
      {info && (
        <p className="mt-0.5 text-[10px]" style={{ color: "var(--fg-subtle)" }}>{info}</p>
      )}
    </div>
  );
}
