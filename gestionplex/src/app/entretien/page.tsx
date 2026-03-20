import { MobileNav } from "@/components/layout/MobileNav";
import { EntretienListe } from "@/components/entretien/EntretienListe";

export const metadata = { title: "Entretien — GestionPlex" };

export default function EntretienPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <EntretienListe />
      </main>
      <MobileNav />
    </div>
  );
}
