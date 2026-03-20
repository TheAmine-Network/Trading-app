"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText, AlertTriangle, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAppData } from "@/lib/DataContext";
import { formatCAD, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { TAL_TAUX_AUGMENTATION_SUGGERE } from "@/lib/constants";

const STATUT_BAIL_LABELS: Record<string, string> = {
  ACTIF: "Actif",
  EXPIRE: "Expiré",
  EN_RENOUVELLEMENT: "En renouvellement",
};

const STATUT_BAIL_VARIANTE: Record<string, "success" | "warning" | "danger" | "info"> = {
  ACTIF: "success",
  EXPIRE: "danger",
  EN_RENOUVELLEMENT: "warning",
};

function joursRestants(dateFin: Date): number {
  const maintenant = new Date();
  return Math.round((new Date(dateFin).getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24));
}

export default function BauxPage() {
  const { baux, locataires, logements, immeubles } = useAppData();
  const bauxAvecDetails = baux.map((bail) => {
    const locataire = locataires.find((l) => l.id === bail.locataireId);
    const logement = logements.find((l) => l.id === bail.logementId);
    const immeuble = immeubles.find((i) => i.id === logement?.immeubleId);
    const jours = joursRestants(bail.dateFin);
    const loyerAugmente =
      bail.loyerMensuel * (1 + TAL_TAUX_AUGMENTATION_SUGGERE / 100);
    return { ...bail, locataire, logement, immeuble, jours, loyerAugmente };
  });

  const bauxExpireBientot = bauxAvecDetails.filter(
    (b) => b.jours <= 90 && b.jours > 0 && b.statut === "ACTIF"
  );

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <div className="min-h-screen">
          {/* En-tête */}
          <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
            <div className="flex items-center gap-3">
              <Link href="/plus" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Baux
                </h1>
                <p className="text-sm text-gray-500">{baux.length} baux actifs</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-5 py-5">
            {/* Alertes expiration */}
            {bauxExpireBientot.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    {bauxExpireBientot.length} bail(s) expire(nt) bientôt
                  </h2>
                </div>
                {bauxExpireBientot.map((bail) => (
                  <div key={bail.id} className="rounded-lg bg-white/60 px-3 py-2 dark:bg-amber-950/30">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                      {bail.locataire?.prenom} {bail.locataire?.nom} — {bail.logement?.numero}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Expire dans {bail.jours} jours · {formatDate(bail.dateFin)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Info TAL */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Augmentation TAL suggérée 2024 : {TAL_TAUX_AUGMENTATION_SUGGERE} %
                </p>
              </div>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                Selon les indices du Tribunal administratif du logement du Québec
              </p>
            </div>

            {/* Liste des baux */}
            <StaggerChildren className="space-y-3">
              {bauxAvecDetails.map((bail) => (
                <StaggerItem key={bail.id}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {bail.locataire?.prenom} {bail.locataire?.nom}
                        </p>
                        <p className="text-xs text-gray-500">
                          {bail.immeuble?.nom} · {bail.logement?.numero}
                        </p>
                      </div>
                      <Badge variante={STATUT_BAIL_VARIANTE[bail.statut]}>
                        {STATUT_BAIL_LABELS[bail.statut]}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Début</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(bail.dateDebut)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Fin</p>
                        <p
                          className={`font-medium ${
                            bail.jours <= 90 && bail.jours > 0
                              ? "text-amber-600"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {formatDate(bail.dateFin)}
                          {bail.jours <= 90 && bail.jours > 0 && (
                            <span className="ml-1 text-xs">({bail.jours}j)</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Loyer actuel</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCAD(bail.loyerMensuel)}/mois
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Augmentation suggérée</p>
                        <p className="font-medium text-green-600">
                          {formatCAD(bail.loyerAugmente)}/mois
                        </p>
                      </div>
                    </div>

                    {bail.clausesSpeciales && (
                      <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {bail.clausesSpeciales}
                      </div>
                    )}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
