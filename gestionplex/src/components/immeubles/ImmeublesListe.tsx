"use client";

import { motion } from "framer-motion";
import { Building2, ChevronRight, MapPin, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useData } from "@/lib/useData";
import { formatCAD } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";

export function ImmeublesListe() {
  const { immeubles, logements } = useData();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* En-tête */}
      <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Mes immeubles
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {immeubles.length} immeubles · {logements.length} logements
        </p>
      </div>

      <div className="px-5 py-5">
        {/* Résumé */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { label: "Immeubles", valeur: immeubles.length.toString() },
            {
              label: "Occupés",
              valeur: `${logements.filter((l) => l.statut === "OCCUPE").length}/${logements.length}`,
            },
            {
              label: "Revenus/mois",
              valeur: formatCAD(
                logements
                  .filter((l) => l.statut === "OCCUPE")
                  .reduce((sum, l) => sum + l.loyerMensuel, 0)
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200/80 bg-white px-3 py-3 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stat.valeur}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Liste des immeubles */}
        <StaggerChildren className="space-y-4">
          {immeubles.map((immeuble) => {
            const logsImm = logements.filter((l) => l.immeubleId === immeuble.id);
            const nbOcc = logsImm.filter((l) => l.statut === "OCCUPE").length;
            const revMensuels = logsImm
              .filter((l) => l.statut === "OCCUPE")
              .reduce((sum, l) => sum + l.loyerMensuel, 0);

            return (
              <StaggerItem key={immeuble.id}>
                <Link href={`/immeubles/${immeuble.id}`}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                  >
                    {/* Photo */}
                    {immeuble.photoUrl && (
                      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={immeuble.photoUrl}
                          alt={immeuble.nom}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 640px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
                        <div>
                          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {immeuble.nom}
                          </h2>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3" />
                            {immeuble.adresse}, {immeuble.ville}
                          </div>
                        </div>
                        <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      </div>

                      {/* Logements */}
                      <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/50">
                        <Home className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-1 gap-2">
                          {logsImm.map((logement) => (
                            <div
                              key={logement.id}
                              className={`flex-1 rounded-lg px-2 py-1.5 text-center text-xs ${
                                logement.statut === "OCCUPE"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : logement.statut === "EN_RENOVATION"
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                              }`}
                            >
                              <p className="font-medium">{logement.numero.split(" ")[0]}</p>
                              <p>{formatCAD(logement.loyerMensuel)}</p>
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {nbOcc}/{logsImm.length}
                        </span>
                      </div>

                      {/* Infos supplémentaires */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                        {immeuble.anneeConstruct && (
                          <span>Construit en {immeuble.anneeConstruct}</span>
                        )}
                        {immeuble.valeurMunicipale && (
                          <span>Val. mun. {formatCAD(immeuble.valeurMunicipale)}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </div>
  );
}
