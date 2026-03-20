"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { useAppData } from "@/lib/DataContext";
import { Badge } from "@/components/ui/badge";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";

export function LocatairesListe() {
  const { locataires, logements, immeubles, refresh } = useAppData();
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<"tous" | "actifs" | "anciens">("actifs");

  const locatairesFiltres = locataires.filter(loc => {
    const nomComplet = `${loc.prenom} ${loc.nom}`.toLowerCase();
    const matchRecherche = nomComplet.includes(recherche.toLowerCase());
    const matchFiltre = filtre === "tous" ? true : filtre === "actifs" ? loc.statut === "ACTIF" : loc.statut === "ANCIEN";
    return matchRecherche && matchFiltre;
  });

  async function updateTelephone(locataireId: string, telephone: string) {
    await fetch(`/api/locataires/${locataireId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telephone }),
    });
    refresh();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b px-5 py-4 backdrop-blur-xl"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}>
          Locataires
        </h1>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          {locataires.filter(l => l.statut === "ACTIF").length} actifs · {locataires.length} total
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--fg-muted)" }} />
          <input
            type="text"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            placeholder="Rechercher un locataire..."
            className="h-11 w-full rounded-xl pl-10 pr-4 text-sm focus:outline-none"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--fg)",
            }}
          />
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          {[
            { val: "actifs", label: "Actifs" },
            { val: "tous",   label: "Tous" },
            { val: "anciens",label: "Anciens" },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setFiltre(f.val as typeof filtre)}
              className="rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
              style={filtre === f.val
                ? { background: "var(--gradient-brand)", color: "white" }
                : { background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        <StaggerChildren className="space-y-3">
          {locatairesFiltres.map(loc => {
            const logement = logements.find(l => l.id === loc.logementId);
            const immeuble = immeubles.find(i => i.id === logement?.immeubleId);

            return (
              <StaggerItem key={loc.id}>
                <div className="card flex items-center gap-4 p-4">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold"
                    style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                    {loc.prenom[0]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link href={`/locataires/${loc.id}`} className="block">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold hover:underline" style={{ color: "var(--fg)" }}>
                          {loc.prenom} {loc.nom}
                        </p>
                        <Badge variante={loc.statut === "ACTIF" ? "success" : "muted"}>
                          {loc.statut === "ACTIF" ? "Actif" : "Ancien"}
                        </Badge>
                      </div>
                    </Link>
                    {logement && immeuble && (
                      <p className="mt-0.5 text-xs" style={{ color: "var(--fg-muted)" }}>
                        {immeuble.nom} · {logement.numero}
                      </p>
                    )}
                    {/* Téléphone éditable inline */}
                    <div className="mt-0.5" onClick={e => e.preventDefault()}>
                      <InlineEdit
                        value={loc.telephone ?? ""}
                        type="text"
                        formatDisplay={v => v ? String(v) : "Ajouter numéro…"}
                        className="text-xs"
                        onSave={val => updateTelephone(loc.id, val)}
                      />
                    </div>
                  </div>

                  <Link href={`/locataires/${loc.id}`}>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "var(--fg-subtle)" }} />
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {locatairesFiltres.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <User className="h-10 w-10" style={{ color: "var(--fg-subtle)" }} />
            <p style={{ color: "var(--fg-muted)" }}>Aucun locataire trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
