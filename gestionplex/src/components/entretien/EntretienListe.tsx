"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Plus, X, ChevronRight, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { demandesEntretien, logements, immeubles } from "@/lib/mock-data";
import { formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import {
  PRIORITE_LABELS,
  PRIORITE_COLORS,
  STATUT_ENTRETIEN_LABELS,
  CATEGORIE_ENTRETIEN_LABELS,
} from "@/lib/constants";

type Statut = "ouvertes" | "terminees";
type Priorite = "TOUTES" | "URGENTE" | "HAUTE" | "NORMALE" | "BASSE";

export function EntretienListe() {
  const [onglet, setOnglet] = useState<Statut>("ouvertes");
  const [prioriteFiltree, setPrioriteFiltree] = useState<Priorite>("TOUTES");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [titreNouveau, setTitreNouveau] = useState("");
  const [descNouveau, setDescNouveau] = useState("");

  const demandesFiltrees = demandesEntretien.filter((d) => {
    const matchOnglet =
      onglet === "ouvertes"
        ? d.statut !== "TERMINEE" && d.statut !== "ANNULEE"
        : d.statut === "TERMINEE" || d.statut === "ANNULEE";
    const matchPriorite =
      prioriteFiltree === "TOUTES" ? true : d.priorite === prioriteFiltree;
    return matchOnglet && matchPriorite;
  });

  const nbOuvertes = demandesEntretien.filter(
    (d) => d.statut !== "TERMINEE" && d.statut !== "ANNULEE"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Entretien
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {nbOuvertes} demande{nbOuvertes !== 1 ? "s" : ""} ouverte{nbOuvertes !== 1 ? "s" : ""}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setFormulaireOuvert(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </motion.button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Onglets */}
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
          {[
            { val: "ouvertes", label: "Ouvertes" },
            { val: "terminees", label: "Terminées" },
          ].map((o) => (
            <button
              key={o.val}
              onClick={() => setOnglet(o.val as Statut)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                onglet === o.val
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Filtre priorité */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(["TOUTES", "URGENTE", "HAUTE", "NORMALE", "BASSE"] as Priorite[]).map((p) => (
            <button
              key={p}
              onClick={() => setPrioriteFiltree(p)}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                prioriteFiltree === p
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
              }`}
            >
              {p === "TOUTES" ? "Toutes" : PRIORITE_LABELS[p]}
            </button>
          ))}
        </div>

        {/* Liste */}
        {demandesFiltrees.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Wrench className="h-7 w-7 text-gray-400" />
            </div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Aucune demande</p>
            <p className="text-sm text-gray-500">
              {onglet === "ouvertes"
                ? "Aucune demande ouverte pour ce filtre."
                : "Aucune demande terminée."}
            </p>
          </div>
        ) : (
          <StaggerChildren className="space-y-3">
            {demandesFiltrees.map((demande) => {
              const logement = logements.find((l) => l.id === demande.logementId);
              const immeuble = immeubles.find((i) => i.id === logement?.immeubleId);
              const prioriteColor = PRIORITE_COLORS[demande.priorite] as
                | "danger"
                | "warning"
                | "info"
                | "muted";

              return (
                <StaggerItem key={demande.id}>
                  <Link href={`/entretien/${demande.id}`}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                            demande.priorite === "URGENTE"
                              ? "bg-red-100 dark:bg-red-900/30"
                              : demande.priorite === "HAUTE"
                              ? "bg-amber-100 dark:bg-amber-900/30"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          {demande.priorite === "URGENTE" ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : (
                            <Wrench className="h-4 w-4 text-gray-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {demande.titre}
                          </p>
                          {logement && immeuble && (
                            <p className="mt-0.5 text-xs text-gray-500">
                              {immeuble.nom} · {logement.numero}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <Badge
                              variante={prioriteColor}
                              pulse={demande.priorite === "URGENTE"}
                            >
                              {PRIORITE_LABELS[demande.priorite]}
                            </Badge>
                            <Badge variante={demande.statut === "TERMINEE" ? "success" : demande.statut === "NOUVELLE" ? "muted" : "warning"}>
                              {STATUT_ENTRETIEN_LABELS[demande.statut]}
                            </Badge>
                            {demande.fournisseurAssigne && (
                              <span className="text-xs text-gray-400">{demande.fournisseurAssigne}</span>
                            )}
                          </div>
                          <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {formatDate(demande.dateOuverture)}
                          </div>
                        </div>

                        <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        )}
      </div>

      {/* Formulaire nouvelle demande */}
      <AnimatePresence>
        {formulaireOuvert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFormulaireOuvert(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white px-5 pb-10 pt-6 dark:bg-gray-950"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Nouvelle demande
                </h2>
                <button
                  onClick={() => setFormulaireOuvert(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={titreNouveau}
                    onChange={(e) => setTitreNouveau(e.target.value)}
                    placeholder="Ex: Fuite robinet cuisine"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={descNouveau}
                    onChange={(e) => setDescNouveau(e.target.value)}
                    placeholder="Décrivez le problème..."
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setFormulaireOuvert(false);
                    setTitreNouveau("");
                    setDescNouveau("");
                  }}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white"
                >
                  Soumettre la demande
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
