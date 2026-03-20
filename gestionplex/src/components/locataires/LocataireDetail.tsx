"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, MessageSquare, Calendar, Home, FileText, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import { locataires, logements, immeubles, baux, transactions, demandesEntretien } from "@/lib/mock-data";
import { formatCAD, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export function LocataireDetail({ id }: { id: string }) {
  const locataire = locataires.find((l) => l.id === id);
  if (!locataire) return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <EmptyState titre="Locataire introuvable" description="Ce locataire n'existe pas." />
    </div>
  );

  const logement = logements.find((l) => l.id === locataire.logementId);
  const immeuble = immeubles.find((i) => i.id === logement?.immeubleId);
  const bailActif = baux.find((b) => b.locataireId === id && b.statut === "ACTIF");
  const txLocataire = transactions
    .filter((t) => t.logementId === locataire.logementId && t.categorie === "LOYER")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
  const demandesLoc = demandesEntretien.filter((d) => d.locataireId === id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
        <div className="flex items-center gap-3">
          <Link href="/locataires" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">
            {locataire.prenom} {locataire.nom}
          </h1>
          <div className="ml-auto">
            <Badge variante={locataire.statut === "ACTIF" ? "success" : "muted"}>
              {locataire.statut === "ACTIF" ? "Actif" : "Ancien"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Avatar + coordonnées */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {locataire.prenom[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {locataire.prenom} {locataire.nom}
              </h2>
              {logement && immeuble && (
                <p className="text-sm text-gray-500">{immeuble.nom} · {logement.numero}</p>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {locataire.telephone && (
              <a href={`tel:${locataire.telephone}`} className="flex flex-col items-center gap-1 rounded-xl bg-green-50 py-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <Phone className="h-5 w-5" />
                <span className="text-xs font-medium">Appeler</span>
              </a>
            )}
            {locataire.telephone && (
              <a href={`sms:${locataire.telephone}`} className="flex flex-col items-center gap-1 rounded-xl bg-blue-50 py-3 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs font-medium">SMS</span>
              </a>
            )}
            {locataire.email && (
              <a href={`mailto:${locataire.email}`} className="flex flex-col items-center gap-1 rounded-xl bg-purple-50 py-3 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                <Mail className="h-5 w-5" />
                <span className="text-xs font-medium">Courriel</span>
              </a>
            )}
          </div>

          {/* Info contact */}
          <div className="mt-4 space-y-2">
            {locataire.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{locataire.email}</span>
              </div>
            )}
            {locataire.telephone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{locataire.telephone}</span>
              </div>
            )}
            {locataire.telephoneUrgence && (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500">Urgence: </span>
                <span className="text-gray-600 dark:text-gray-400">{locataire.telephoneUrgence}</span>
              </div>
            )}
            {locataire.dateNaissance && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{formatDate(locataire.dateNaissance)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bail actif */}
        {bailActif && (
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500">Bail actif</h2>
              <Badge variante="success">Actif</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Loyer mensuel</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCAD(bailActif.loyerMensuel)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Début</span>
                <span className="text-gray-900 dark:text-gray-100">{formatDate(bailActif.dateDebut)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fin</span>
                <span className="text-gray-900 dark:text-gray-100">{formatDate(bailActif.dateFin)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Historique des paiements */}
        {txLocataire.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-500">Historique des loyers</h2>
            <div className="space-y-2">
              {txLocataire.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{tx.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                  </div>
                  <p className="text-sm font-semibold text-green-600">+{formatCAD(tx.montant)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demandes d'entretien */}
        {demandesLoc.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-500">Demandes d&apos;entretien</h2>
            <div className="space-y-2">
              {demandesLoc.map((d) => (
                <Link key={d.id} href={`/entretien/${d.id}`}>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{d.titre}</p>
                      <p className="text-xs text-gray-500">{formatDate(d.dateOuverture)}</p>
                    </div>
                    <Badge variante={d.statut === "TERMINEE" ? "success" : "warning"}>
                      {d.statut === "TERMINEE" ? "Terminée" : "En cours"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {locataire.notes && (
          <div className="rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
            <p className="text-xs font-medium text-amber-700">Notes</p>
            <p className="mt-1 text-sm text-amber-900 dark:text-amber-300">{locataire.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
