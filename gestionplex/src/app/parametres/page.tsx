"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Sun, Moon, Download, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAppData } from "@/lib/DataContext";
import { APP_NOM, APP_PROPRIETAIRE } from "@/lib/constants";

function Toggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!active)}
      animate={{ backgroundColor: active ? "#2563eb" : "#e5e7eb" }}
      className="relative h-6 w-11 rounded-full"
    >
      <motion.div
        animate={{ x: active ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
      />
    </motion.button>
  );
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {titre}
      </h2>
      <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}

function Ligne({ label, description, action }: { label: string; description?: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4 first:rounded-t-2xl last:rounded-b-2xl [&:not(:last-child)]:border-b [&:not(:last-child)]:border-gray-100 dark:[&:not(:last-child)]:border-gray-800">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function ParametresPage() {
  const { immeubles } = useAppData();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [themeSombre, setThemeSombre] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
          <div className="flex items-center gap-3">
            <Link href="/plus" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Paramètres</h1>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* Profil */}
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
              {APP_PROPRIETAIRE[0]}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{APP_PROPRIETAIRE}</p>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                Propriétaire · {immeubles.length} immeuble{immeubles.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Immeubles */}
          {immeubles.length > 0 && (
            <Section titre="Immeubles">
              {immeubles.map(imm => (
                <Ligne
                  key={imm.id}
                  label={imm.nom}
                  description={`${imm.adresse}, ${imm.ville}`}
                  action={<ChevronRight className="h-4 w-4 text-gray-400" />}
                />
              ))}
            </Section>
          )}

          {/* Notifications */}
          <Section titre="Notifications">
            <Ligne
              label="Notifications par courriel"
              description="Rappels et alertes importantes"
              action={<Toggle active={notifEmail} onChange={setNotifEmail} />}
            />
            <Ligne
              label="Notifications push"
              description="Alertes en temps réel"
              action={<Toggle active={notifPush} onChange={setNotifPush} />}
            />
          </Section>

          {/* Affichage */}
          <Section titre="Affichage">
            <Ligne
              label="Mode sombre"
              description="Thème sombre pour économiser la batterie"
              action={
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-gray-400" />
                  <Toggle active={themeSombre} onChange={setThemeSombre} />
                  <Moon className="h-4 w-4 text-gray-400" />
                </div>
              }
            />
          </Section>

          {/* Exportation */}
          <Section titre="Données">
            <Ligne
              label="Exporter en CSV"
              description="Transactions et données locataires"
              action={
                <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <Download className="h-3.5 w-3.5" />
                  Exporter
                </motion.button>
              }
            />
            <Ligne
              label="Rapport fiscal PDF"
              description="Revenus de location — T776 / TP-128"
              action={
                <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
                  <FileText className="h-3.5 w-3.5" />
                  PDF
                </motion.button>
              }
            />
          </Section>

          {/* À propos */}
          <Section titre="À propos">
            <Ligne label="Version" action={<span className="text-sm text-gray-400">1.0.0</span>} />
            <Ligne
              label={APP_NOM}
              description="Application de gestion immobilière personnelle"
              action={<ChevronRight className="h-4 w-4 text-gray-400" />}
            />
          </Section>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
