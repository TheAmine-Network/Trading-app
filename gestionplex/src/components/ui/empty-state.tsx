import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  titre: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icone?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  titre,
  description,
  actionLabel,
  onAction,
  icone,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900/30",
        className
      )}
    >
      {icone ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          {icone}
        </div>
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg
            className="h-7 w-7 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {titre}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variante="primary" taille="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
