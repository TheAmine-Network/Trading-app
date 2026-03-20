import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  erreur?: string;
  aide?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, erreur, aide, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400",
            erreur && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {erreur && (
          <p className="text-xs text-red-500">{erreur}</p>
        )}
        {aide && !erreur && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{aide}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
