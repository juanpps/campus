"use server";

import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function getGlobalConfig() {
    try {
        const configDoc = await getDoc(doc(db, "config", "general"));
        if (configDoc.exists()) {
            return { success: true, data: configDoc.data() };
        }
        return { success: false, message: "No se encontró configuración" };
    } catch (error) {
        return { success: false, message: "Error al leer configuración" };
    }
}

export async function updateGlobalConfig(data: any) {
    try {
        const configRef = doc(db, "config", "general");
        await setDoc(configRef, data, { merge: true });
        revalidatePath("/(admin)/configuracion");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Error al actualizar" };
    }
}

export async function completarOnboarding(userId: string) {
    try {
        await updateDoc(doc(db, "usuarios", userId), {
            onboarding_completado: true
        });
        revalidatePath("/(estudiante)/perfil");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Error al actualizar onboarding" };
    }
}
