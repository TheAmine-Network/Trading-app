"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Users, Wrench, DollarSign, FileText, Settings, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/",          label: "Dashboard",  icon: Home,       desc: "Vue d'ensemble" },
  { href: "/immeubles", label: "Immeubles",  icon: Building2,  desc: "Vos propriétés" },
  { href: "/locataires",label: "Locataires", icon: Users,       desc: "Vos locataires" },
  { href: "/entretien", label: "Entretien",  icon: Wrench,      desc: "Demandes actives" },
  { href: "/finances",  label: "Finances",   icon: DollarSign,  desc: "Revenus & dépenses" },
  { href: "/baux",      label: "Baux",       icon: FileText,    desc: "Contrats de bail" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50"
      style={{
        width: "240px",
        background: "var(--bg-elevated)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Brand */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-white font-extrabold text-lg flex-shrink-0"
            style={{ background: "var(--gradient-brand)", boxShadow: "0 4px 14px rgba(88,86,214,0.4)" }}
          >
            G
          </div>
          <div>
            <p className="font-bold text-[15px]" style={{ color: "var(--fg)", letterSpacing: "-0.01em" }}>GestionPlex</p>
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>Amine · Propriétaire</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                  isActive ? "text-white" : ""
                )}
                style={
                  isActive
                    ? { background: "var(--gradient-brand)", boxShadow: "0 4px 12px rgba(88,86,214,0.3)" }
                    : { color: "var(--fg-muted)" }
                }
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Plex AI hint */}
      <div className="px-3 pb-2">
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-3"
          style={{ background: "var(--accent-muted)" }}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>Plex AI</p>
            <p className="text-[11px]" style={{ color: "var(--fg-muted)" }}>Cliquez sur le bouton ↘</p>
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
            <Settings className="h-[18px] w-[18px] flex-shrink-0" />
            <span className="text-sm font-medium">Paramètres</span>
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}
