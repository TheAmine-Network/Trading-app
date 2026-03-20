import { MobileNav } from "@/components/layout/MobileNav";
import { LocatairesListe } from "@/components/locataires/LocatairesListe";

export const metadata = { title: "Locataires — GestionPlex" };

export default function LocatairesPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <LocatairesListe />
      </main>
      <MobileNav />
    </div>
  );
}
