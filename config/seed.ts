import { adminDb } from "../src/lib/firebase/admin";

/**
 * Script para sembrar la estructura base de Firestore de Método Raptor.
 * Ejecutar localmente con: npx ts-node config/seed.ts
 */
export async function seedFirestore() {
    console.log("Iniciando inyección de Seed en Firestore...");

    // 1. Configuración General (Control de Banner y Modal)
    await adminDb.collection("config").doc("general").set({
        banner_modal_activo: true,
        banner_titulo: "¡Bienvenido a la Fase 04!",
        banner_mensaje: "La plataforma se encuentra en fase de pruebas Beta.",
        version: "0.4.0",
        actualizado_en: new Date()
    });
    console.log("✔️ Documento 'config/general' inicializado.");

    // 2. Cohorte Actual (Periodo Académico)
    await adminDb.collection("cohortes").doc("2026-I").set({
        nombre: "PreICFES 2026 Primera Fase",
        inicio: new Date("2026-02-01"),
        fin: new Date("2026-08-01"),
        estado: "activo",
        estudiantes_inscritos: 0
    });
    console.log("✔️ Cohorte '2026-I' inicializada.");

    // 3. Documento Stub de un Usuario Estudiante Dummy
    await adminDb.collection("usuarios").doc("dummy-student").set({
        email: "estudiante@ejemplo.com",
        rol: "estudiante",
        nombre: "Dino Estudiante",
        icfes_objetivo: 350,
        progreso_general: 45,
        cohorte_actual: "2026-I",
    });
    console.log("✔️ Usuario Stub inicializado.");

    console.log("✅ Seed finalizado con éxito.");
}

// Ejecutar si se invoca directo
// seedFirestore().catch(console.error);
