import { cn } from "@/lib/utils";

type VariantBadge =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted"
  | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variante?: VariantBadge;
  className?: string;
  pulse?: boolean;
}

const varianteClasses: Record<VariantBadge, string> = {
  default: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  muted: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  outline: "border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400",
};

export function Badge({ children, variante = "default", className, pulse }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        varianteClasses[variante],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              variante === "danger" ? "bg-red-500" : "bg-current"
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              variante === "danger" ? "bg-red-500" : "bg-current"
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
