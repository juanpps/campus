import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getMessaging } from "firebase-admin/messaging";
import adminApp from "@/lib/firebase/admin";

/**
 * Endpoint de Recordatorio de Eventos (Clases)
 * Se ejecuta vía webhook externo seguro cada N minutos.
 * Busca clases que comiencen en exactamente 15 minutos.
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Validación de Seguridad (Bearer Token)
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        // 2. Definir ventana de tiempo (Próximos 15 minutos)
        const now = new Date();
        const targetTime = new Date(now.getTime() + 15 * 60000); // +15 minutos

        // Rango de búsqueda para evitar perder eventos por segundos (±1 min de los 15 min)
        const startTime = new Date(targetTime.getTime() - 60000);
        const endTime = new Date(targetTime.getTime() + 60000);

        // 3. Consultar clases próximas
        const clasesSnapshot = await adminDb.collection("clases")
            .where("fecha", ">=", startTime)
            .where("fecha", "<=", endTime)
            .get();

        if (clasesSnapshot.empty) {
            return NextResponse.json({ message: "No hay clases programadas en la ventana de 15 min." });
        }

        // 4. Obtener todos los tokens FCM de estudiantes activos
        const usersSnapshot = await adminDb.collection("usuarios")
            .where("rol", "==", "estudiante")
            .where("estado", "==", "activo")
            .get();

        const tokens: string[] = [];
        usersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.fcm_token) {
                tokens.push(data.fcm_token);
            }
        });

        if (tokens.length === 0) {
            return NextResponse.json({ message: "No hay tokens registrados para enviar notificaciones." });
        }

        // 5. Enviar Notificaciones Multicast
        const messaging = getMessaging(adminApp);
        const notifications = clasesSnapshot.docs.map(docClase => {
            const clase = docClase.data();
            return {
                notification: {
                    title: "⏰ ¡Casi empezamos!",
                    body: `Raptorcito, en 15 minutos comienza tu clase de: ${clase.titulo}`,
                },
                data: {
                    url: `/clases/${docClase.id}`,
                    tag: "recordatorio_clase"
                },
                tokens
            };
        });

        // Envío por cada clase encontrada
        const results = await Promise.all(
            notifications.map(msg => messaging.sendEachForMulticast(msg))
        );

        return NextResponse.json({
            success: true,
            clases_impactadas: clasesSnapshot.size,
            envios_realizados: results.length
        });

    } catch (error: any) {
        console.error("Error en recordatorio-eventos:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Permitir POST para servicios como Upstash que prefieren webhooks POST
export const POST = GET;
