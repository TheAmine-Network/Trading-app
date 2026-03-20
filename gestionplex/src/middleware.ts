import { type NextRequest, NextResponse } from "next/server";

// Mode démo — auth désactivée (pas de clés Supabase requises)
// Pour activer l'auth: importer updateSession depuis @/lib/supabase/middleware
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
