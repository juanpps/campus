"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

/**
 * Pre-aprovisiona una cuenta de administrador en Firebase Auth y Firestore.
 * Elimina el "Catch-22" permitiendo que el Super Admin cree la cuenta antes de que el 
 * usuario intente loguearse por primera vez.
 */
export async function asignarRolAdmin(email: string) {
    try {
        // 1. Obtener o crear el usuario en Firebase Auth
        let uid: string;
        try {
            const userRecord = await adminAuth.getUserByEmail(email);
            uid = userRecord.uid;
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                // El usuario no existe, lo creamos proactivamente
                const newUser = await adminAuth.createUser({
                    email: email,
                    emailVerified: false,
                    disabled: false,
                });
                uid = newUser.uid;
            } else {
                throw error;
            }
        }

        // 2. Sincronizar el rol en Firestore
        await adminDb.collection("usuarios").doc(uid).set({
            correo: email,
            rol: "admin",
            estado: "activo",
            fecha_registro: new Date(),
        }, { merge: true });

        revalidatePath("/(superadmin)/administradores");
        return { success: true, message: "Cuenta aprovisionada correctamente." };

    } catch (error: any) {
        console.error("Error en provisionamiento:", error);
        return { success: false, message: error.message || "Error desconocido al aprovisionar." };
    }
}
