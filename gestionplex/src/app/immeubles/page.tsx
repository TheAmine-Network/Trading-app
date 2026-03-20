import { MobileNav } from "@/components/layout/MobileNav";
import { ImmeublesListe } from "@/components/immeubles/ImmeublesListe";

export const metadata = { title: "Immeubles — GestionPlex" };

export default function ImmeublesPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <ImmeublesListe />
      </main>
      <MobileNav />
    </div>
  );
}
