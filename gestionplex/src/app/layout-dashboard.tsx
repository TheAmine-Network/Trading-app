// Layout du dashboard — avec navigation mobile
// Ce fichier est importé dans src/app/layout.tsx via le layout racine

import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">{children}</main>
      <MobileNav />
    </div>
  );
}
