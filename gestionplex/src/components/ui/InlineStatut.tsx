"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StatutOption {
  value: string;
  label: string;
  color?: string;
  bg?: string;
}

interface InlineStatutProps {
  value: string;
  options: StatutOption[];
  onSave: (val: string) => Promise<void>;
  renderBadge: (value: string) => React.ReactNode;
}

export function InlineStatut({ value, options, onSave, renderBadge }: InlineStatutProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function select(newVal: string) {
    setOpen(false);
    if (newVal === value) return;
    setSaving(true);
    await onSave(newVal);
    setSaving(false);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        disabled={saving}
        className="group inline-flex items-center gap-1 transition-opacity"
        title="Cliquer pour changer le statut"
        style={{ opacity: saving ? 0.6 : 1 }}
      >
        {renderBadge(value)}
        <ChevronDown
          className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50"
          style={{ color: "var(--fg-muted)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-[100] mt-1.5 min-w-[170px] overflow-hidden rounded-2xl py-1.5 shadow-2xl"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={e => { e.preventDefault(); e.stopPropagation(); select(opt.value); }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition-all hover:opacity-80"
                style={{
                  color: opt.value === value ? "var(--accent)" : "var(--fg)",
                  background: opt.value === value ? "var(--accent-muted)" : "transparent",
                  fontWeight: opt.value === value ? 600 : 400,
                }}
              >
                {opt.bg && (
                  <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: opt.bg }} />
                )}
                {opt.label}
                {opt.value === value && <span className="ml-auto text-xs">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
