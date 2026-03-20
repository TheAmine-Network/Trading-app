import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ChatBot } from "@/components/chatbot/ChatBot";

export const metadata: Metadata = {
  title: "GestionPlex — Gestion immobilière",
  description: "Application de gestion immobilière personnelle pour propriétaires montréalais",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GestionPlex",
  },
  formatDetection: {
    telephone: false,
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
