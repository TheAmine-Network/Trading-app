import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { DataProvider } from "@/lib/DataContext";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "GestionPlex — Gestion immobilière",
  description: "Application de gestion immobilière personnelle pour propriétaires montréalais",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GestionPlex",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "GestionPlex",
    description: "Gérez vos immeubles locatifs facilement",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-CA" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" style={{ background: "var(--bg)" }}>
        <DataProvider>
          {/* Desktop sidebar */}
          <Sidebar />

          {/* Main content — décalé de 240px sur desktop */}
          <div className="md:pl-[240px] min-h-screen">
            {children}
          </div>

          <ChatBot />
        </DataProvider>
      </body>
    </html>
  );
}
