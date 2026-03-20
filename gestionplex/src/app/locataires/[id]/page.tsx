import { MobileNav } from "@/components/layout/MobileNav";
import { LocataireDetail } from "@/components/locataires/LocataireDetail";

export const metadata = { title: "Fiche locataire — GestionPlex" };

export default async function LocataireDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <LocataireDetail id={id} />
      </main>
      <MobileNav />
    </div>
  );
}
