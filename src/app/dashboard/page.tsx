import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/admin";

export default async function DashboardDispatcher() {
    const cookieStore = await cookies();
    const session = cookieStore.get("__session")?.value;

    if (!session) {
        redirect("/login");
    }

    // Nota: Para máxima velocidad en el dispatcher, consultamos el rol.
    // En una implementación real con Custom Claims, esto se leería del token decodificado.
    // Para el Campus Raptor v1.0.0, usamos una consulta rápida a adminDb.

    // Asumimos que el session cookie es el ID de sesión o token. 
    // Usaremos un placeholder o lógica de sesión aquí:
    try {
        // TODO: Leer rol real desde Custom Claims en Auth. 
        // Por ahora, usamos el flujo de /bridge para determinar el destino dinámico.
        redirect("/bridge");
    } catch (error) {
        redirect("/login");
    }
}
