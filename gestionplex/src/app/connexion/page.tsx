"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function ConnexionPage() {
  const [courriel, setCourriel] = useState("");
  const [envoyé, setEnvoyé] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChargement(true);
    // TODO: connecter à Supabase Auth
    setEnvoyé(true);
    setChargement(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6 dark:from-gray-950 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              GestionPlex
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gestion immobilière simplifiée
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {!envoyé ? (
            <>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Connexion
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Entrez votre courriel pour recevoir un lien magique.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Adresse courriel
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={courriel}
                      onChange={(e) => setCourriel(e.target.value)}
                      placeholder="amine@exemple.com"
                      required
                      className="h-11 w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  disabled={chargement || !courriel}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {chargement ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Recevoir le lien magique
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-4 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Courriel envoyé !
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Vérifiez votre boîte courriel à <strong>{courriel}</strong> pour vous connecter.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Démo */}
        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Accéder à la démo →
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Application réservée au propriétaire
        </p>
      </motion.div>
    </div>
  );
}
