import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: Request) {
    try {
        const { titulo, descripcion, archivoDriveId, numPreguntas, claves } = await req.json();

        // 1. Guardar metadatos públicos del simulacro
        const docRef = await adminDb.collection("simulacros").add({
            titulo,
            descripcion,
            archivoDriveId,
            numPreguntas,
            createdAt: new Date().toISOString()
        });

        // 2. Patrón DevSecOps: Guardar el array de respuestas en sub-colección privada
        // Las Firebase Security Rules denegarán la lectura de `/simulacros/{id}/privado/clave` a cualquier cliente
        await docRef.collection("privado").doc("clave").set({
            respuestas: claves // ["A", "C", "D", ...]
        });

        // 3. Trigger FCM: Notificar disponibilidad del simulacro (no-bloqueante)
        try {
            const baseUrl = process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : "http://localhost:3000";
            fetch(`${baseUrl}/api/notifications/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tokens: [], // TODO: Poblar con tokens FCM de estudiantes desde Firestore
                    title: "Nuevo Simulacro Disponible",
                    body: `"${titulo}" está listo para resolver.`,
                    url: `/simulacro/${docRef.id}`,
                    tag: `simulacro-${docRef.id}`,
                }),
            }).catch((err) => console.warn("[FCM Trigger] Simulacro:", err));
        } catch (fcmErr) {
            console.warn("[FCM Trigger] Error no-crítico:", fcmErr);
        }

        return NextResponse.json({ id: docRef.id, success: true });
    } catch (error) {
        console.error("API Error creando simulacro:", error);
        return NextResponse.json({ error: "Fallo crÃ­tico al orquestar Firestore" }, { status: 500 });
    }
}
