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

        return NextResponse.json({ id: docRef.id, success: true });
    } catch (error) {
        console.error("API Error creando simulacro:", error);
        return NextResponse.json({ error: "Fallo crÃ­tico al orquestar Firestore" }, { status: 500 });
    }
}
