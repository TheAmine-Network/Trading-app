import { cn } from "@/lib/utils";

type VariantBadge = "default" | "success" | "warning" | "danger" | "info" | "muted" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variante?: VariantBadge;
  className?: string;
  pulse?: boolean;
}

const varianteStyles: Record<VariantBadge, React.CSSProperties> = {
  default:  { background: "var(--accent-muted)",   color: "var(--accent)" },
  success:  { background: "var(--success-muted)",  color: "var(--success)" },
  warning:  { background: "var(--warning-muted)",  color: "var(--warning)" },
  danger:   { background: "var(--danger-muted)",   color: "var(--danger)" },
  info:     { background: "var(--info-muted)",     color: "var(--info)" },
  muted:    { background: "var(--bg-tertiary)",    color: "var(--fg-muted)" },
  outline:  { background: "transparent",           color: "var(--fg-muted)", border: "1px solid var(--border-strong)" },
};

export function Badge({ children, variante = "default", className, pulse }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", className)}
      style={{ letterSpacing: "-0.01em", ...varianteStyles[variante] }}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: varianteStyles[variante].color as string }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ background: varianteStyles[variante].color as string }} />
        </span>
      )}
      {children}
    </span>
  );
}
