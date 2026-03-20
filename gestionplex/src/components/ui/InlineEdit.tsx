"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";

interface InlineEditProps {
  value: number | string;
  type?: "number" | "text";
  prefix?: string;
  suffix?: string;
  className?: string;
  formatDisplay?: (val: number | string) => string;
  onSave: (val: string) => Promise<void>;
}

export function InlineEdit({
  value,
  type = "text",
  prefix,
  suffix,
  className = "",
  formatDisplay,
  onSave,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(value));
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVal(String(value));
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  async function save() {
    if (val === String(value)) { setEditing(false); return; }
    setSaving(true);
    await onSave(val);
    setSaving(false);
    setEditing(false);
  }

  function cancel() {
    setVal(String(value));
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
        {prefix && <span className="text-xs" style={{ color: "var(--fg-muted)" }}>{prefix}</span>}
        <input
          ref={inputRef}
          type={type}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
          disabled={saving}
          className="w-24 rounded-lg px-2 py-0.5 text-sm font-semibold focus:outline-none"
          style={{
            border: "2px solid var(--accent)",
            color: "var(--fg)",
            background: "var(--bg-elevated)",
            minWidth: "60px",
          }}
        />
        {suffix && <span className="text-xs" style={{ color: "var(--fg-muted)" }}>{suffix}</span>}
        <button onClick={save} disabled={saving}
          className="flex h-5 w-5 items-center justify-center rounded-full"
          style={{ background: "var(--success-muted)", color: "var(--success)" }}>
          <Check className="h-3 w-3" />
        </button>
        <button onClick={cancel}
          className="flex h-5 w-5 items-center justify-center rounded-full"
          style={{ background: "var(--bg-tertiary)", color: "var(--fg-muted)" }}>
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); e.preventDefault(); setEditing(true); }}
      className={`group inline-flex items-center gap-1 transition-all ${className}`}
      title="Cliquer pour modifier"
    >
      <span>
        {prefix}{formatDisplay ? formatDisplay(value) : value}{suffix}
      </span>
      <Pencil
        className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40"
        style={{ color: "var(--accent)" }}
      />
    </button>
  );
}
