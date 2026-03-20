"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAppData } from "@/lib/DataContext";
import { formatCAD } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { InlineStatut } from "@/components/ui/InlineStatut";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";

const STATUT_LOGEMENT_OPTIONS = [
  { value: "OCCUPE",        label: "Occupé",        bg: "var(--success)" },
  { value: "VACANT",        label: "Vacant",        bg: "var(--fg-subtle)" },
  { value: "EN_RENOVATION", label: "En rénovation", bg: "var(--warning)" },
];

function StatutBadge({ statut }: { statut: string }) {
  if (statut === "OCCUPE")
    return <Badge variante="success">Occupé</Badge>;
  if (statut === "EN_RENOVATION")
    return <Badge variante="warning">Rénovation</Badge>;
  return <Badge variante="muted">Vacant</Badge>;
}

export function ImmeublesListe() {
  const { immeubles, logements, refresh } = useAppData();

  async function updateLoyer(logementId: string, loyer: string) {
    await fetch(`/api/logements/${logementId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loyerMensuel: Number(loyer) }),
    });
    refresh();
  }

  async function updateStatutLogement(logementId: string, statut: string) {
    await fetch(`/api/logements/${logementId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    refresh();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b px-5 py-4 backdrop-blur-xl"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}>
          Mes immeubles
        </h1>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          {immeubles.length} immeubles · {logements.length} logements
        </p>
      </div>

      <div className="px-5 py-5">
        {/* Résumé */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { label: "Immeubles", valeur: String(immeubles.length) },
            { label: "Occupés", valeur: `${logements.filter(l => l.statut === "OCCUPE").length}/${logements.length}` },
            { label: "Revenus/mois", valeur: formatCAD(logements.filter(l => l.statut === "OCCUPE").reduce((s, l) => s + l.loyerMensuel, 0)) },
          ].map(stat => (
            <div key={stat.label} className="card px-3 py-3 text-center">
              <p className="text-lg font-bold tabular-nums" style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}>{stat.valeur}</p>
              <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Liste */}
        <StaggerChildren className="space-y-4">
          {immeubles.map(immeuble => {
            const logsImm = logements.filter(l => l.immeubleId === immeuble.id);
            const nbOcc = logsImm.filter(l => l.statut === "OCCUPE").length;
            const revMensuels = logsImm.filter(l => l.statut === "OCCUPE").reduce((s, l) => s + l.loyerMensuel, 0);

            return (
              <StaggerItem key={immeuble.id}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="card overflow-hidden"
                >
                  {/* Photo */}
                  {immeuble.photoUrl && (
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image src={immeuble.photoUrl} alt={immeuble.nom} fill className="object-cover"
                        sizes="(max-width: 640px) 100vw, 640px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <Badge variante="default" className="bg-white/90 text-gray-800">
                          {immeuble.type === "TRIPLEX" ? "Triplex" : "Duplex"}
                        </Badge>
                        <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                          {formatCAD(revMensuels)}/mois
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contenu */}
                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <Link href={`/immeubles/${immeuble.id}`} className="min-w-0 flex-1">
                        <h2 className="text-base font-semibold" style={{ color: "var(--fg)" }}>{immeuble.nom}</h2>
                        <div className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--fg-muted)" }}>
                          <MapPin className="h-3 w-3" />
                          {immeuble.adresse}, {immeuble.ville}
                        </div>
                      </Link>
                      <Link href={`/immeubles/${immeuble.id}`}>
                        <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>Voir détail →</span>
                      </Link>
                    </div>

                    {/* Logements avec inline edit */}
                    <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--bg-secondary)" }}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Home className="h-3.5 w-3.5" style={{ color: "var(--fg-muted)" }} />
                          <span className="text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>
                            {nbOcc}/{logsImm.length} occupés
                          </span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: "var(--fg-muted)" }}>
                          Cliquez pour modifier →
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {logsImm.map(logement => (
                          <div
                            key={logement.id}
                            className="flex-1 rounded-xl px-2 py-2 text-center text-xs"
                            style={{
                              background: logement.statut === "OCCUPE"
                                ? "var(--success-muted)"
                                : logement.statut === "EN_RENOVATION"
                                ? "var(--warning-muted)"
                                : "var(--bg-tertiary)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <p className="font-bold mb-1" style={{ color: "var(--fg)", fontSize: "11px" }}>
                              {logement.numero.split(" ")[0]}
                            </p>

                            {/* Loyer éditable inline */}
                            <div className="flex justify-center">
                              <InlineEdit
                                value={logement.loyerMensuel}
                                type="number"
                                formatDisplay={v => formatCAD(Number(v))}
                                className="text-xs font-semibold"
                                onSave={val => updateLoyer(logement.id, val)}
                              />
                            </div>

                            {/* Statut éditable inline */}
                            <div className="mt-1 flex justify-center">
                              <InlineStatut
                                value={logement.statut}
                                options={STATUT_LOGEMENT_OPTIONS}
                                onSave={val => updateStatutLogement(logement.id, val)}
                                renderBadge={v => <StatutBadge statut={v} />}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {immeuble.anneeConstruct || immeuble.valeurMunicipale ? (
                      <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: "var(--fg-muted)" }}>
                        {immeuble.anneeConstruct && <span>Construit en {immeuble.anneeConstruct}</span>}
                        {immeuble.valeurMunicipale && <span>Val. mun. {formatCAD(immeuble.valeurMunicipale)}</span>}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </div>
  );
}
