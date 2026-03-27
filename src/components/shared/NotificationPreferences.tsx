"use client";

import { useState } from "react";

interface NotificationPreferencesProps {
    userId: string;
}

export function NotificationPreferences({ userId }: NotificationPreferencesProps) {
    const [prefs, setPrefs] = useState({
        clases: true,
        simulacros: true,
        anuncios: true,
        sistema: true,
    });

    const handleToggle = (key: keyof typeof prefs) => {
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
        // TODO: Persistir en Firestore /users/{userId}/preferences
        console.log(`[FCM Prefs] ${key} → ${!prefs[key]} | userId: ${userId}`);
    };

    const items = [
        { key: "clases" as const, label: "Clases en Vivo", desc: "Avisos de nuevas sesiones y recordatorios" },
        { key: "simulacros" as const, label: "Simulacros", desc: "Disponibilidad de pruebas y resultados" },
        { key: "anuncios" as const, label: "Anuncios", desc: "Comunicados del campus y tutores" },
        { key: "sistema" as const, label: "Sistema", desc: "Actualizaciones de la plataforma" },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferencias de Notificaciones</h3>
            <p className="text-sm text-muted-foreground">
                Personaliza qué tipo de alertas push deseas recibir.
            </p>
            <div className="space-y-3">
                {items.map((item) => (
                    <label
                        key={item.key}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={prefs[item.key]}
                            onChange={() => handleToggle(item.key)}
                            className="h-4 w-4 rounded border-input accent-primary"
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
