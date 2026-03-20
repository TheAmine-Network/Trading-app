"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CountUp } from "@/components/animations/CountUp";

interface StatCardProps {
  titre: string;
  valeur: number;
  enCAD?: boolean;
  suffixe?: string;
  tendance?: number;
  icone: React.ReactNode;
  gradient?: string;
  delay?: number;
}

export function StatCard({
  titre,
  valeur,
  enCAD = false,
  suffixe = "",
  tendance,
  icone,
  gradient = "linear-gradient(135deg, #5856d6 0%, #af52de 100%)",
  delay = 0,
}: StatCardProps) {
  const tendancePositive = tendance !== undefined && tendance >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}
      whileTap={{ scale: 0.97 }}
      className="card p-4"
    >
      {/* Icon */}
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
        style={{ background: gradient }}
      >
        {icone}
      </div>

      {/* Value */}
      <div className="mt-3">
        <p className="section-title mb-1">{titre}</p>
        <p
          className="text-2xl font-bold tabular-nums tracking-tight"
          style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}
        >
          <CountUp valeur={valeur} enCAD={enCAD} suffixe={suffixe} />
        </p>
      </div>

      {/* Trend */}
      {tendance !== undefined && (
        <div className="mt-2">
          <span
            className="stat-pill"
            style={
              tendancePositive
                ? { background: "var(--success-muted)", color: "var(--success)" }
                : { background: "var(--danger-muted)", color: "var(--danger)" }
            }
          >
            {tendancePositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(tendance).toFixed(1)} %
          </span>
        </div>
      )}
    </motion.div>
  );
}
