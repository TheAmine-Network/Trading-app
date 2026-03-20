import { MobileNav } from "@/components/layout/MobileNav";
import { ImmeubleDetail } from "@/components/immeubles/ImmeubleDetail";

export const metadata = { title: "Détail immeuble — GestionPlex" };

export default async function ImmeubleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <ImmeubleDetail id={id} />
      </main>
      <MobileNav />
    </div>
  );
}
