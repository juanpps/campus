import { NextRequest, NextResponse } from "next/server";
import { driveClient, MAIN_FOLDER_ID } from "@/lib/drive/config";
import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
    try {
        // 1. Verificación Definitiva de Seguridad
        const sessionCookie = req.cookies.get("__session")?.value;
        if (!sessionCookie) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

        // Obtener rol nativo desde DB para asegurar integridad (Firebase en cliente podría estar comprometido)
        const userSnap = await adminDb.collection("usuarios").doc(decodedClaims.uid).get();

        if (!userSnap.exists) return NextResponse.json({ error: "Usuario no existe" }, { status: 403 });
        const rol = userSnap.data()?.rol;

        if (rol !== "tutor" && rol !== "admin" && rol !== "superadmin") {
            return NextResponse.json({ error: "Veto de permisos. Prohibida invocación a GCP Drive." }, { status: 403 });
        }

        // 2. Procesamiento Multipart/Form-Data del navegador
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 });
        }

        // Convertir a buffer primitivo y posteriormente un Streaming Readable Type Node (compatibilidad con googleapis)
        const buffer = await file.arrayBuffer();
        const readableFileStream = new Readable();
        readableFileStream._read = () => { };
        readableFileStream.push(Buffer.from(buffer));
        readableFileStream.push(null);

        // 3. Subida directa a Carpeta Designada en Service Account
        const driveRes = await driveClient.files.create({
            requestBody: {
                name: file.name,
                parents: MAIN_FOLDER_ID ? [MAIN_FOLDER_ID] : [], // Si no hay ID, se sube a la raíz del Service Account
            },
            media: {
                mimeType: file.type, // Autodetección o fallback client
                body: readableFileStream,
            },
            fields: "id", // Sólo necesitamos el ID como pointer externo
        });

        return NextResponse.json({ success: true, fileId: driveRes.data.id });

    } catch (error) {
        console.error("[Drive API Upload] Interrupción de flujo de GCP:", error);
        return NextResponse.json({ error: "Error procesando el flujo contra GCP" }, { status: 500 });
    }
}
