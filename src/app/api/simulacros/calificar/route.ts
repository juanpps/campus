import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: Request) {
    try {
        const { simulacroId, respuestasEstudiante } = await req.json();

        // Acceso Server-Side seguro usando credencial Firebase Admin
        const claveDoc = await adminDb.collection("simulacros").doc(simulacroId).collection("privado").doc("clave").get();
        if (!claveDoc.exists) return NextResponse.json({ error: "Patrón de calificación extraviado" }, { status: 404 });

        const { respuestas } = claveDoc.data() as { respuestas: string[] };

        let correctas = 0;
        const incorrectas: number[] = [];

        // Cálculo Server-Side (Zero Trust client calculation)
        respuestas.forEach((ans, idx) => {
            if (ans === respuestasEstudiante[idx]) {
                correctas++;
            } else {
                incorrectas.push(idx);
            }
        });

        const puntaje = Math.round((correctas / respuestas.length) * 100);

        // Guardado de intento (Omitido parcial para simplificar el scope de este endpoint)

        // Estricto: Jamás devolver el array `respuestas` correctas.
        return NextResponse.json({
            puntaje,
            correctas,
            total: respuestas.length,
            incorrectas
        });

    } catch (error) {
        console.error("API Error evaluando prueba:", error);
        return NextResponse.json({ error: "El motor de calificación falló" }, { status: 500 });
    }
}
