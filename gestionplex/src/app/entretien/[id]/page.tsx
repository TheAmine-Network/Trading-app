import { MobileNav } from "@/components/layout/MobileNav";
import { EntretienDetail } from "@/components/entretien/EntretienDetail";

export const metadata = { title: "Entretien — GestionPlex" };

export default async function EntretienDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <EntretienDetail id={id} />
      </main>
      <MobileNav />
    </div>
  );
}
