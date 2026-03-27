import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import app from "./client";

let messaging: Messaging | null = null;

function getMessagingInstance(): Messaging | null {
    if (typeof window === "undefined") return null;
    if (!messaging) {
        try {
            messaging = getMessaging(app);
        } catch (error) {
            console.warn("FCM no disponible:", error);
            return null;
        }
    }
    return messaging;
}

export async function requestNotificationPermission(): Promise<string | null> {
    const m = getMessagingInstance();
    if (!m) return null;

    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.log("El usuario denegó las notificaciones.");
            return null;
        }

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey || vapidKey === "BH_xxxxx_placeholder") {
            console.warn("VAPID Key no configurada. Notificaciones deshabilitadas.");
            return null;
        }

        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        const token = await getToken(m as Messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        return token;
    } catch (error) {
        console.error("Error obteniendo token FCM:", error);
        return null;
    }
}

export function onForegroundMessage(callback: (payload: unknown) => void): (() => void) | null {
    const m = getMessagingInstance();
    if (!m) return null;
    return onMessage(m, callback);
}

export { messaging };
