import { NextRequest, NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import adminApp from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tokens, title, body: messageBody, url, tag } = body;

        if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
            return NextResponse.json(
                { error: "Se requiere un array de tokens FCM." },
                { status: 400 }
            );
        }

        if (!title) {
            return NextResponse.json(
                { error: "Se requiere un título para la notificación." },
                { status: 400 }
            );
        }

        const messaging = getMessaging(adminApp);

        const message = {
            notification: {
                title,
                body: messageBody || "",
            },
            data: {
                url: url || "/",
                tag: tag || String(Date.now()),
            },
            tokens: tokens as string[],
        };

        const response = await messaging.sendEachForMulticast(message);

        return NextResponse.json({
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
        });
    } catch (error) {
        console.error("Error enviando notificación FCM:", error);
        return NextResponse.json(
            { error: "Error interno al enviar notificación." },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ status: "FCM Notification API activa" });
}
