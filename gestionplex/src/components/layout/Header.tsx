"use client";

import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeaderProps {
  titre?: string;
  sousTitre?: string;
  retour?: boolean;
  actions?: React.ReactNode;
  transparent?: boolean;
}

export function Header({
  titre,
  sousTitre,
  retour,
  actions,
  transparent,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between px-5 py-4",
        !transparent &&
          "border-b border-gray-200/80 bg-white/85 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85"
      )}
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
    >
      <div className="flex items-center gap-3">
        {retour && (
          <Link
            href="javascript:history.back()"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <div>
          {titre && (
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {titre}
            </h1>
          )}
          {sousTitre && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{sousTitre}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <Link
          href="/parametres"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </motion.header>
  );
}
