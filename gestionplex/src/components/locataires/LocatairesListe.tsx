"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Phone, Mail, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { useAppData } from "@/lib/DataContext";
import { Badge } from "@/components/ui/badge";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";

export function LocatairesListe() {
  const { locataires, logements, immeubles } = useAppData();
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<"tous" | "actifs" | "anciens">("actifs");

  const locatairesFiltres = locataires.filter((loc) => {
    const nomComplet = `${loc.prenom} ${loc.nom}`.toLowerCase();
    const matchRecherche = nomComplet.includes(recherche.toLowerCase());
    const matchFiltre =
      filtre === "tous"
        ? true
        : filtre === "actifs"
        ? loc.statut === "ACTIF"
        : loc.statut === "ANCIEN";
    return matchRecherche && matchFiltre;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Locataires
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {locataires.filter((l) => l.statut === "ACTIF").length} actifs
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un locataire..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          {[
            { val: "actifs", label: "Actifs" },
            { val: "tous", label: "Tous" },
            { val: "anciens", label: "Anciens" },
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setFiltre(f.val as typeof filtre)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filtre === f.val
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        <StaggerChildren className="space-y-3">
          {locatairesFiltres.map((loc) => {
            const logement = logements.find((l) => l.id === loc.logementId);
            const immeuble = immeubles.find((i) => i.id === logement?.immeubleId);

            return (
              <StaggerItem key={loc.id}>
                <Link href={`/locataires/${loc.id}`}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                  >
                    {/* Avatar */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-lg font-bold dark:bg-blue-900/30 dark:text-blue-400">
                      {loc.prenom[0]}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {loc.prenom} {loc.nom}
                        </p>
                        <Badge variante={loc.statut === "ACTIF" ? "success" : "muted"}>
                          {loc.statut === "ACTIF" ? "Actif" : "Ancien"}
                        </Badge>
                      </div>
                      {logement && immeuble && (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {immeuble.nom} · {logement.numero}
                        </p>
                      )}
                      {loc.telephone && (
                        <p className="mt-0.5 text-xs text-gray-400">{loc.telephone}</p>
                      )}
                    </div>

                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  </motion.div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {locatairesFiltres.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <User className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500">Aucun locataire trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
