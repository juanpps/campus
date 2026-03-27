import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get("__session")?.value;
        if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

        // Solo Admin y Superadmin pueden generar links
        const userDoc = await adminDb.collection("usuarios").doc(decodedClaims.uid).get();
        const rol = userDoc.data()?.rol;

        if (rol !== "admin" && rol !== "superadmin") {
            return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
        }

        const { emailDestino, rolDestino } = await request.json();

        if (!emailDestino || !rolDestino) {
            return NextResponse.json({ error: "Faltan parametros" }, { status: 400 });
        }

        // Generar un token único y seguro
        const tokenStr = crypto.randomBytes(32).toString('hex');
        const expiracion = new Date();
        expiracion.setHours(expiracion.getHours() + 24); // 24 horas

        // Guardar el token en firestore
        await adminDb.collection("invitaciones").doc(tokenStr).set({
            token: tokenStr,
            email: emailDestino,
            rol_asignado: rolDestino,
            creado_por: decodedClaims.uid,
            usado: false,
            expira_en: expiracion.toISOString()
        });

        const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/bridge?token=${tokenStr}`;

        return NextResponse.json({ status: "success", link: inviteLink });

    } catch (error) {
        console.error("Link generation error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
