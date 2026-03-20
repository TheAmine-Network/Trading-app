"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Building2,
  DollarSign,
  Wrench,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const onglets = [
  {
    href: "/",
    label: "Accueil",
    icone: Home,
  },
  {
    href: "/immeubles",
    label: "Immeubles",
    icone: Building2,
  },
  {
    href: "/finances",
    label: "Finances",
    icone: DollarSign,
  },
  {
    href: "/entretien",
    label: "Entretien",
    icone: Wrench,
  },
  {
    href: "/plus",
    label: "Plus",
    icone: MoreHorizontal,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  function estActif(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 backdrop-blur-xl dark:border-gray-800/80"
      style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
    >
      <div className="dark:bg-gray-950/85 absolute inset-0 -z-10" />
      <div className="flex items-center justify-around px-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)", paddingTop: "8px" }}
      >
        {onglets.map((onglet) => {
          const actif = estActif(onglet.href);
          const Icone = onglet.icone;

          return (
            <Link
              key={onglet.href}
              href={onglet.href}
              className="relative flex min-w-[44px] flex-col items-center gap-1 py-1"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative flex flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
                    actif && "bg-blue-50 dark:bg-blue-950/50"
                  )}
                >
                  <Icone
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      actif
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                    strokeWidth={actif ? 2.5 : 2}
                  />
                  {actif && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 h-0.5 w-4 rounded-full bg-blue-600 dark:bg-blue-400"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    actif
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {onglet.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
