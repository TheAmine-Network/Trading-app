import { MobileNav } from "@/components/layout/MobileNav";
import { FinancesVue } from "@/components/finances/FinancesVue";

export const metadata = { title: "Finances — GestionPlex" };

export default function FinancesPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <FinancesVue />
      </main>
      <MobileNav />
    </div>
  );
}
