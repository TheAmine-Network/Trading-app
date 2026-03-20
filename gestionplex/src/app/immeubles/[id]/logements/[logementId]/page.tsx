import { MobileNav } from "@/components/layout/MobileNav";
import { LogementDetail } from "@/components/immeubles/LogementDetail";

export const metadata = { title: "Logement — GestionPlex" };

export default async function LogementDetailPage({ params }: { params: Promise<{ id: string; logementId: string }> }) {
  const { id, logementId } = await params;
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <LogementDetail immeubleId={id} logementId={logementId} />
      </main>
      <MobileNav />
    </div>
  );
}
