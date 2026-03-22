import { MobileNav } from "@/components/layout/MobileNav";

export const metadata = { title: "Documents — GestionPlex" };

export default function DocumentsPage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">
      <main className="pb-24">
        <div className="min-h-screen">
          <div className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/85">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Documents</h1>
            <p className="text-sm text-gray-500">Gérez vos documents immobiliers</p>
          </div>
          <div className="px-5 py-8">
            <div className="flex flex-col items-center gap-4 text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Aucun document</h3>
                <p className="text-sm text-gray-500">Vos baux, assurances et factures apparaîtront ici.</p>
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Ajouter un document
              </button>
            </div>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
