import { NouvelImmeubleForm } from "@/components/immeubles/NouvelImmeubleForm";
import { MobileNav } from "@/components/layout/MobileNav";

export default function NouvelImmeublePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <main className="pb-28">
        <NouvelImmeubleForm />
      </main>
      <MobileNav />
    </div>
  );
}
