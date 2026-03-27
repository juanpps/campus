import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_ROUTES = {
    estudiante: "/estudiante-dashboard",
    tutor: "/tutor-dashboard",
    admin: "/admin-dashboard",
    superadmin: "/superadmin-dashboard"
};

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("__session")?.value;
    const path = request.nextUrl.pathname;

    // Rutas públicas que no requieren autenticación
    const isAuthRoute = path.startsWith("/login") || path.startsWith("/registro") || path.startsWith("/bridge");

    if (!session && !isAuthRoute) {
        if (path === "/" || Object.values(ROLE_ROUTES).some(route => path.startsWith(route.replace(/\/\(.*\)/, '')))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (session) {
        // Si tiene sesión y entra a auth (login), lo redigirimos al middleware check
        // Nota: La validación real de los roles requiere fetch al servidor (Firestore) o tener los custom claims en el JWT.
        // Para eficiencia severa, Next.js Middleware Edge no soporta Firebase Admin SDK directo.
        // Por tanto, la autorización granular del payload JWT se manejará con Custom Claims inyectados durante el auth
        // o redirigiendo a /bridge si es primer login.

        if (path === "/") {
            // Redirección de Root -> Dashboard
            return NextResponse.redirect(new URL("/bridge", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.json
         * - icons
         */
        "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons).*)",
    ],
};
