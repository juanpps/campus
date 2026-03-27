import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    User,
} from "firebase/auth";
import { auth } from "./client";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User | null> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);

        // Al autenticar cliente, obtenemos el ID token para la sesión del servidor
        const idToken = await result.user.getIdToken();

        // Llamada a nuestro endpoint interno para crear la cookie HttpOnly
        const res = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        });

        if (!res.ok) throw new Error("Fallo al crear sesión en el servidor");

        return result.user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};

export const signOut = async () => {
    try {
        // 1. Borrar sesión del servidor (cookie)
        await fetch("/api/auth/session", { method: "DELETE" });
        // 2. Cerrar sesión en el cliente
        await firebaseSignOut(auth);
        window.location.href = "/login";
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
};
