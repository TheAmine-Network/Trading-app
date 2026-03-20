"use client";

import { motion } from "framer-motion";
import { Plus, Wrench, DollarSign, Camera, MessageSquare, Home } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "Nouvelle dépense",
    icone: Plus,
    gradient: "linear-gradient(135deg, #5856d6 0%, #af52de 100%)",
    href: "/finances/depenses",
  },
  {
    label: "Entretien",
    icone: Wrench,
    gradient: "linear-gradient(135deg, #ff9f0a 0%, #ff6b00 100%)",
    href: "/entretien",
  },
  {
    label: "Loyer reçu",
    icone: DollarSign,
    gradient: "linear-gradient(135deg, #34c759 0%, #28a745 100%)",
    href: "/finances/revenus",
  },
  {
    label: "Immeuble",
    icone: Home,
    gradient: "linear-gradient(135deg, #007aff 0%, #5856d6 100%)",
    href: "/immeubles/nouveau",
  },
  {
    label: "Document",
    icone: Camera,
    gradient: "linear-gradient(135deg, #ff2d55 0%, #ff375f 100%)",
    href: "/documents",
  },
  {
    label: "Locataire",
    icone: MessageSquare,
    gradient: "linear-gradient(135deg, #30b0c7 0%, #007aff 100%)",
    href: "/locataires",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action, index) => {
        const Icone = action.icone;
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 + 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.93 }}
          >
            <Link
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-2xl p-3.5 transition-all hover:brightness-110"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm"
                style={{ background: action.gradient }}
              >
                <Icone className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span
                className="text-center text-[11px] font-semibold leading-tight"
                style={{ color: "var(--fg-secondary)" }}
              >
                {action.label}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
