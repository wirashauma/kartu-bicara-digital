import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Izinkan request untuk aset statis, API internal, dan halaman publik
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/faq" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasAuth = request.cookies.get("kbd_auth_logged_in");

  // Jika pengunjung belum login dan membuka root (/) atau profil -> langsung arahkan ke /login
  if (!hasAuth && (pathname === "/" || pathname.startsWith("/profil") || pathname.startsWith("/profile"))) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profil", "/profile", "/login"],
};

