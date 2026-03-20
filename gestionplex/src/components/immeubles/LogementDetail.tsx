"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft, Home, User, Thermometer,
  Zap, Droplets, Car, Package, Check, X, Phone, Mail as MailIcon
} from "lucide-react";
import Link from "next/link";
import { useAppData } from "@/lib/DataContext";
import { formatCAD, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { InlineStatut } from "@/components/ui/InlineStatut";
import { EmptyState } from "@/components/ui/empty-state";

const STATUT_LABELS: Record<string, string> = {
  OCCUPE: "Occupé", VACANT: "Vacant", EN_RENOVATION: "En rénovation",
};
const STATUT_VARIANTE: Record<string, "success" | "warning" | "info"> = {
  OCCUPE: "success", VACANT: "warning", EN_RENOVATION: "info",
};
const STATUT_LOGEMENT_OPTIONS = [
  { value: "OCCUPE",        label: "Occupé",        bg: "var(--success)" },
  { value: "VACANT",        label: "Vacant",        bg: "var(--fg-muted)" },
  { value: "EN_RENOVATION", label: "En rénovation", bg: "var(--warning)" },
];

interface LogementDetailProps { immeubleId: string; logementId: string }

export function LogementDetail({ immeubleId, logementId }: LogementDetailProps) {
  const { logements, locataires, baux, transactions, immeubles, demandesEntretien, refresh } = useAppData();

  const logement = logements.find(l => l.id === logementId);
  const immeuble = immeubles.find(i => i.id === immeubleId);

  if (!logement || !immeuble) {
    return (
      <div className="flex min-h-screen items-center justify-center p-5">
        <EmptyState titre="Logement introuvable" description="Ce logement n'existe pas." />
      </div>
    );
  }

  const locataire = locataires.find(l => l.logementId === logementId);
  const bailActif = baux.find(b => b.logementId === logementId && b.statut === "ACTIF");
  const txLog = transactions
    .filter(t => t.logementId === logementId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const inclusions = [
    { label: "Chauffage",    actif: logement.inclChauffage,     icone: <Thermometer className="h-3.5 w-3.5" /> },
    { label: "Eau chaude",   actif: logement.inclEauChaude,     icone: <Droplets className="h-3.5 w-3.5" /> },
    { label: "Électricité",  actif: logement.inclElectricite,   icone: <Zap className="h-3.5 w-3.5" /> },
    { label: "Station.",     actif: logement.inclStationnement, icone: <Car className="h-3.5 w-3.5" /> },
    { label: "Rangement",    actif: logement.inclRangement,     icone: <Package className="h-3.5 w-3.5" /> },
  ];

  async function patchLogement(body: Record<string, unknown>) {
    await fetch(`/api/logements/${logementId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    refresh();
  }

  async function patchLocataire(body: Record<string, unknown>) {
    if (!locataire) return;
    await fetch(`/api/locataires/${locataire.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    refresh();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b px-5 py-4 backdrop-blur-xl"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <div className="flex items-center gap-3">
          <Link href={`/immeubles/${immeubleId}`}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: "var(--bg-tertiary)" }}>
            <ArrowLeft className="h-4 w-4" style={{ color: "var(--fg)" }} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold" style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}>
              {logement.numero}
            </h1>
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{immeuble.nom}</p>
          </div>
          {/* Statut éditable inline dans le header */}
          <InlineStatut
            value={logement.statut}
            options={STATUT_LOGEMENT_OPTIONS}
            onSave={val => patchLogement({ statut: val })}
            renderBadge={v => <Badge variante={STATUT_VARIANTE[v] ?? "muted"}>{STATUT_LABELS[v] ?? v}</Badge>}
          />
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        {/* Stats — ÉDITABLES */}
        <div className="grid grid-cols-3 gap-3">
          {/* Loyer */}
          <div className="card px-3 py-3 text-center">
            <div className="flex justify-center">
              <InlineEdit
                value={logement.loyerMensuel}
                type="number"
                formatDisplay={v => formatCAD(Number(v))}
                className="text-lg font-bold"
                onSave={val => patchLogement({ loyerMensuel: Number(val) })}
              />
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>/mois</p>
          </div>
          {/* Chambres */}
          <div className="card px-3 py-3 text-center">
            <div className="flex justify-center">
              <InlineEdit
                value={logement.nbChambres ?? "—"}
                type="number"
                className="text-lg font-bold"
                onSave={val => patchLogement({ nbChambres: Number(val) })}
              />
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>chambres</p>
          </div>
          {/* Superficie */}
          <div className="card px-3 py-3 text-center">
            <div className="flex justify-center">
              <InlineEdit
                value={logement.superficie ?? "—"}
                type="number"
                className="text-lg font-bold"
                onSave={val => patchLogement({ superficie: Number(val) })}
              />
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>pi²</p>
          </div>
        </div>

        {/* Inclusions */}
        <div className="card p-5">
          <h2 className="section-title mb-3">Inclusions</h2>
          <div className="grid grid-cols-5 gap-2">
            {inclusions.map(incl => (
              <div key={incl.label}
                className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-center"
                style={{
                  background: incl.actif ? "var(--success-muted)" : "var(--bg-secondary)",
                  color: incl.actif ? "var(--success)" : "var(--fg-subtle)",
                }}>
                {incl.icone}
                <span className="text-[9px] font-medium leading-tight">{incl.label}</span>
                {incl.actif
                  ? <Check className="h-2.5 w-2.5" />
                  : <X className="h-2.5 w-2.5 opacity-40" />}
              </div>
            ))}
          </div>
        </div>

        {/* Locataire */}
        {locataire ? (
          <div className="card p-5">
            <h2 className="section-title mb-3">Locataire actuel</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold"
                style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                {locataire.prenom[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold" style={{ color: "var(--fg)" }}>
                  {locataire.prenom} {locataire.nom}
                </p>
                {/* Email éditable */}
                {locataire.email !== undefined && (
                  <InlineEdit
                    value={locataire.email ?? ""}
                    type="text"
                    formatDisplay={v => v ? String(v) : "Ajouter email…"}
                    className="text-xs mt-0.5"
                    onSave={val => patchLocataire({ email: val })}
                  />
                )}
              </div>
              <Link href={`/locataires/${locataire.id}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "var(--bg-tertiary)" }}>
                  <User className="h-4 w-4" style={{ color: "var(--fg-muted)" }} />
                </div>
              </Link>
            </div>

            {/* Téléphone éditable */}
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-3.5 w-3.5" style={{ color: "var(--fg-muted)" }} />
                <InlineEdit
                  value={locataire.telephone ?? ""}
                  type="text"
                  formatDisplay={v => v ? String(v) : "Ajouter téléphone…"}
                  className="text-sm font-medium"
                  onSave={val => patchLocataire({ telephone: val })}
                />
              </div>
              <div className="flex gap-2">
                {locataire.telephone && (
                  <a href={`tel:${locataire.telephone}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium"
                    style={{ background: "var(--success-muted)", color: "var(--success)" }}>
                    <Phone className="h-4 w-4" />Appeler
                  </a>
                )}
                {locataire.email && (
                  <a href={`mailto:${locataire.email}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium"
                    style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                    <MailIcon className="h-4 w-4" />Courriel
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed p-5 text-center"
            style={{ borderColor: "var(--border-strong)" }}>
            <User className="mx-auto mb-2 h-8 w-8" style={{ color: "var(--fg-subtle)" }} />
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Aucun locataire actuellement</p>
          </div>
        )}

        {/* Bail actif */}
        {bailActif && (
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="section-title">Bail actif</h2>
              <Badge variante="success">Actif</Badge>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Début",                 valeur: formatDate(bailActif.dateDebut) },
                { label: "Fin",                   valeur: formatDate(bailActif.dateFin) },
                { label: "Loyer",                 valeur: `${formatCAD(bailActif.loyerMensuel)}/mois` },
                ...(bailActif.augmentationAnnuelle ? [{ label: "Augmentation annuelle", valeur: `${bailActif.augmentationAnnuelle} %` }] : []),
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--fg-muted)" }}>{row.label}</span>
                  <span className="font-semibold" style={{ color: "var(--fg)" }}>{row.valeur}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions récentes */}
        {txLog.length > 0 && (
          <div>
            <h2 className="section-title mb-3">Transactions récentes</h2>
            <div className="space-y-2">
              {txLog.map(tx => (
                <div key={tx.id} className="card flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--fg)" }}>{tx.description}</p>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{formatDate(tx.date)}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums flex-shrink-0"
                    style={{ color: tx.type === "REVENU" ? "var(--success)" : "var(--danger)" }}>
                    {tx.type === "REVENU" ? "+" : "−"}{formatCAD(tx.montant)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes — éditables */}
        <div className="card p-4">
          <h2 className="section-title mb-2">Notes</h2>
          <InlineEdit
            value={logement.notes ?? ""}
            type="text"
            formatDisplay={v => v ? String(v) : "Cliquez pour ajouter une note…"}
            className="text-sm w-full"
            onSave={val => patchLogement({ notes: val })}
          />
        </div>
      </div>
    </div>
  );
}
