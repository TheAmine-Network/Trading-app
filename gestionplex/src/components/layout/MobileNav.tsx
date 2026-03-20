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
  { href: "/", label: "Accueil", icone: Home },
  { href: "/immeubles", label: "Immeubles", icone: Building2 },
  { href: "/finances", label: "Finances", icone: DollarSign },
  { href: "/entretien", label: "Entretien", icone: Wrench },
  { href: "/plus", label: "Plus", icone: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  function estActif(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center justify-around px-2"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 8px), 8px)",
          paddingTop: "8px",
        }}
      >
        {onglets.map((onglet) => {
          const actif = estActif(onglet.href);
          const Icone = onglet.icone;

          return (
            <Link
              key={onglet.href}
              href={onglet.href}
              className="relative flex min-w-[52px] flex-col items-center gap-1 py-1"
            >
              <motion.div
                whileTap={{ scale: 0.82 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="relative flex flex-col items-center gap-1"
              >
                {/* Pill indicator for active item */}
                {actif && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -inset-x-3 -inset-y-1 rounded-2xl"
                    style={{ background: "var(--accent-muted)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex h-7 w-7 items-center justify-center">
                  <Icone
                    className={cn(
                      "h-[22px] w-[22px] transition-all duration-200",
                    )}
                    style={{
                      color: actif ? "var(--accent)" : "var(--fg-muted)",
                      strokeWidth: actif ? 2.5 : 1.8,
                    }}
                  />
                </div>

                <span
                  className="relative z-10 text-[10px] font-semibold transition-colors duration-200"
                  style={{ color: actif ? "var(--accent)" : "var(--fg-subtle)" }}
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
