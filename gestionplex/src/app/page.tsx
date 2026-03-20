import { MobileNav } from "@/components/layout/MobileNav";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <DashboardPage />
      </main>
      <MobileNav />
    </div>
  );
}
