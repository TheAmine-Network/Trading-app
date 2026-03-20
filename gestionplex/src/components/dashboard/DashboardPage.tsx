"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  AlertCircle,
  ChevronRight,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "./StatCard";
import { OccupancyRing } from "./OccupancyRing";
import { RevenueChart } from "./RevenueChart";
import { QuickActions } from "./QuickActions";
import { Badge } from "@/components/ui/badge";
import { formatCAD, formatDateRelative, formatDate } from "@/lib/formatters";
import {
  transactions,
  demandesEntretien,
  rappels,
  getStatsFinancieresMois,
  getStatsParMois,
  getTauxOccupation,
  logements,
  immeubles,
} from "@/lib/mock-data";
import { PRIORITE_COLORS, PRIORITE_LABELS, STATUT_ENTRETIEN_LABELS } from "@/lib/constants";

const COULEURS_PRIORITE: Record<string, "danger" | "warning" | "info" | "muted"> = {
  URGENTE: "danger",
  HAUTE: "warning",
  NORMALE: "info",
  BASSE: "muted",
};

export function DashboardPage() {
  const maintenant = new Date();
  const statsActuels = getStatsFinancieresMois(
    maintenant.getFullYear(),
    maintenant.getMonth()
  );
  const statsMoisPrec = getStatsFinancieresMois(
    maintenant.getFullYear(),
    maintenant.getMonth() - 1
  );

  const tendanceRevenus =
    statsMoisPrec.revenus > 0
      ? ((statsActuels.revenus - statsMoisPrec.revenus) / statsMoisPrec.revenus) * 100
      : 0;

  const tendanceDepenses =
    statsMoisPrec.depenses > 0
      ? ((statsActuels.depenses - statsMoisPrec.depenses) / statsMoisPrec.depenses) * 100
      : 0;

  const donneesMois = getStatsParMois(6);
  const { nbOccupes, nbTotal, taux } = getTauxOccupation();

  const demandesOuvertes = demandesEntretien.filter(
    (d) => d.statut !== "TERMINEE" && d.statut !== "ANNULEE"
  );

  const rappelsActifs = rappels.filter((r) => r.statut === "ACTIF").slice(0, 3);

  const jourSemaine = maintenant.toLocaleDateString("fr-CA", { weekday: "long" });
  const dateAujourd = maintenant.toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
        <div className="flex items-center justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              {jourSemaine} · {dateAujourd}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
            >
              Bonjour, Amine 👋
            </motion.h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
            </motion.button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              A
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 py-5">
        {/* Stats financières */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Ce mois-ci
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              titre="Revenus"
              valeur={statsActuels.revenus}
              enCAD
              tendance={tendanceRevenus}
              icone={<TrendingUp className="h-5 w-5" />}
              couleurIcone="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              delay={0.1}
            />
            <StatCard
              titre="Dépenses"
              valeur={statsActuels.depenses}
              enCAD
              tendance={tendanceDepenses}
              icone={<TrendingDown className="h-5 w-5" />}
              couleurIcone="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              delay={0.15}
            />
            <StatCard
              titre="Profit net"
              valeur={statsActuels.profit}
              enCAD
              icone={<Wallet className="h-5 w-5" />}
              couleurIcone="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              delay={0.2}
            />
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <OccupancyRing nbOccupes={nbOccupes} nbTotal={nbTotal} taux={taux} />
            </div>
          </div>
        </motion.section>

        {/* Actions rapides */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Actions rapides
          </h2>
          <QuickActions />
        </section>

        {/* Rappels */}
        {rappelsActifs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Prochains rappels
              </h2>
              <Link
                href="/parametres"
                className="text-xs text-blue-600 dark:text-blue-400"
              >
                Voir tout
              </Link>
            </div>
            <div className="space-y-2">
              {rappelsActifs.map((rappel) => (
                <motion.div
                  key={rappel.id}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {rappel.titre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(rappel.date)}
                    </p>
                  </div>
                  <span
                    className={
                      new Date(rappel.date) <= new Date()
                        ? "text-xs text-red-500"
                        : "text-xs text-gray-400"
                    }
                  >
                    {formatDateRelative(rappel.date)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Demandes d'entretien ouvertes */}
        {demandesOuvertes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Entretien en cours
              </h2>
              <Link
                href="/entretien"
                className="text-xs text-blue-600 dark:text-blue-400"
              >
                Voir tout
              </Link>
            </div>
            <div className="space-y-2">
              {demandesOuvertes.slice(0, 3).map((demande) => {
                const logement = logements.find((l) => l.id === demande.logementId);
                const immeuble = immeubles.find(
                  (i) => i.id === logement?.immeubleId
                );
                return (
                  <Link key={demande.id} href={`/entretien/${demande.id}`}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                          {demande.titre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {immeuble?.nom} · {logement?.numero}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variante={COULEURS_PRIORITE[demande.priorite]}
                          pulse={demande.priorite === "URGENTE"}
                        >
                          {PRIORITE_LABELS[demande.priorite]}
                        </Badge>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Graphique revenus vs dépenses */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Revenus vs dépenses — 6 derniers mois
            </h2>
            <Link href="/finances" className="text-xs text-blue-600 dark:text-blue-400">
              Détail
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
                <span className="text-gray-600 dark:text-gray-400">Revenus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
                <span className="text-gray-600 dark:text-gray-400">Dépenses</span>
              </div>
            </div>
            <RevenueChart donnees={donneesMois} />
          </div>
        </motion.section>

        {/* Immeubles résumé */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="pb-2"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Mes immeubles
            </h2>
            <Link href="/immeubles" className="text-xs text-blue-600 dark:text-blue-400">
              Voir tout
            </Link>
          </div>
          <div className="space-y-2">
            {immeubles.map((immeuble) => {
              const logsImm = logements.filter(
                (l) => l.immeubleId === immeuble.id
              );
              const nbOcc = logsImm.filter((l) => l.statut === "OCCUPE").length;
              const revenusMensuels = logsImm
                .filter((l) => l.statut === "OCCUPE")
                .reduce((sum, l) => sum + l.loyerMensuel, 0);

              return (
                <Link key={immeuble.id} href={`/immeubles/${immeuble.id}`}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                      <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {immeuble.nom}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {nbOcc}/{logsImm.length} logements occupés
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCAD(revenusMensuels)}
                      </p>
                      <p className="text-xs text-gray-400">/mois</p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
