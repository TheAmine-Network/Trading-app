"use client";

import { motion } from "framer-motion";
import {
  Users, FileText, FolderOpen, Settings, ChevronRight,
  Building2, HelpCircle, Star
} from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";

const sections = [
  {
    titre: "Gestion",
    liens: [
      { href: "/locataires", label: "Locataires", description: "Gérer vos locataires", icone: Users, couleur: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
      { href: "/baux", label: "Baux", description: "Contrats de location", icone: FileText, couleur: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
      { href: "/documents", label: "Documents", description: "Fichiers et pièces jointes", icone: FolderOpen, couleur: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    ],
  },
  {
    titre: "Application",
    liens: [
      { href: "/parametres", label: "Paramètres", description: "Profil, notifications, thème", icone: Settings, couleur: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    ],
  },
];

export default function PlusPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Plus</h1>
          <p className="text-sm text-gray-500">Toutes les sections</p>
        </div>

        <div className="space-y-6 px-5 py-5">
          {/* Résumé rapide */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">A</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Amine</p>
                <p className="text-sm text-gray-500">Propriétaire · 2 immeubles · 5 logements</p>
              </div>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <div key={section.titre}>
              <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {section.titre}
              </h2>
              <StaggerChildren className="space-y-2">
                {section.liens.map((lien) => {
                  const Icone = lien.icone;
                  return (
                    <StaggerItem key={lien.href}>
                      <Link href={lien.href}>
                        <motion.div
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${lien.couleur}`}>
                            <Icone className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-100">{lien.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{lien.description}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </motion.div>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </StaggerChildren>
            </div>
          ))}

          {/* Info app */}
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">GestionPlex v1.0</p>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Application de gestion immobilière pour propriétaires montréalais.
              Gérez vos immeubles, locataires, finances et entretien en un seul endroit.
            </p>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
