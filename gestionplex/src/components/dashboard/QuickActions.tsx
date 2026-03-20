"use client";

import { motion } from "framer-motion";
import { Plus, Wrench, DollarSign, Camera } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "Nouvelle dépense",
    icone: Plus,
    couleur: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    href: "/finances/depenses",
  },
  {
    label: "Demande d'entretien",
    icone: Wrench,
    couleur: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    href: "/entretien",
  },
  {
    label: "Enregistrer un loyer",
    icone: DollarSign,
    couleur: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    href: "/finances/revenus",
  },
  {
    label: "Scanner un reçu",
    icone: Camera,
    couleur: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    href: "/documents",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => {
        const Icone = action.icone;
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 + 0.2, ease: "easeOut" }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.couleur}`}>
                <Icone className="h-5 w-5" />
              </div>
              <span className="text-center text-xs font-medium leading-tight text-gray-700 dark:text-gray-300">
                {action.label}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
