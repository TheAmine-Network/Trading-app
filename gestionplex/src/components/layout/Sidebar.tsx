"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Users, Wrench, DollarSign, FileText, Settings, Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAppData } from "@/lib/DataContext";

const navItems = [
  { href: "/",           label: "Dashboard",  icon: Home },
  { href: "/immeubles",  label: "Immeubles",  icon: Building2 },
  { href: "/locataires", label: "Locataires", icon: Users },
  { href: "/entretien",  label: "Entretien",  icon: Wrench },
  { href: "/finances",   label: "Finances",   icon: DollarSign },
  { href: "/baux",       label: "Baux",       icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { demandesEntretien } = useAppData();
  const urgentes = demandesEntretien.filter(d => d.priorite === "URGENTE" && !["TERMINEE","ANNULEE"].includes(d.statut)).length;

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50 overflow-hidden"
      style={{
        width: "240px",
        background: "var(--bg-elevated)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Brand hero */}
      <div
        className="relative overflow-hidden px-5 py-6"
        style={{ background: "var(--gradient-hero)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Ambient orb */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7c7ce0 0%, transparent 70%)" }} />
        <div className="relative flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-black text-base flex-shrink-0"
            style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-accent)" }}
          >
            G
          </div>
          <div>
            <p className="font-bold text-sm text-white" style={{ letterSpacing: "-0.02em" }}>GestionPlex</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Amine · Propriétaire</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map(item => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const badge = item.href === "/entretien" && urgentes > 0 ? urgentes : null;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all relative")}
                style={
                  isActive
                    ? {
                        background: "var(--accent-muted)",
                        color: "var(--accent)",
                        fontWeight: 600,
                      }
                    : { color: "var(--fg-muted)" }
                }
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
                <item.icon className="h-[17px] w-[17px] flex-shrink-0" />
                <span className="text-sm flex-1">{item.label}</span>
                {badge && (
                  <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                    style={{ background: "var(--danger)", fontSize: "10px", lineHeight: 1, padding: "2px 5px" }}>
                    {badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Plex AI CTA */}
      <div className="px-3 pb-2">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-3 cursor-default"
          style={{
            background: "var(--gradient-brand-subtle)",
            border: "1px solid var(--accent-muted)",
          }}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-accent)" }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold" style={{ color: "var(--accent)", letterSpacing: "-0.01em" }}>Plex AI</p>
              <Zap className="h-3 w-3" style={{ color: "var(--warning)" }} />
            </div>
            <p className="text-[11px]" style={{ color: "var(--fg-muted)" }}>Bouton en bas à droite ↘</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="p-3 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
        <Link href="/parametres">
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
            style={{ color: "var(--fg-muted)" }}
          >
            <Settings className="h-[17px] w-[17px] flex-shrink-0" />
            <span className="text-sm">Paramètres</span>
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}
