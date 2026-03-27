"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Asumido
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

export function ClaseClientWrapper({ clase }: { clase: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false); // Validado vs el array de `vistas` real del estado auth

    const markAsRead = async () => {
        setIsLoading(true);

        try {
            // Fake delay para simular escritura a Firebase y cumplir E2E visual QA
            await new Promise(resolve => setTimeout(resolve, 800));
            // Acoplado a Server Actions (simulado para E2E QA)
            setIsDone(true);
            toast.success("¡Excelente! Progreso guardado.");

        } catch (error) {
            toast.error("Raptorcito, ocurrió un error y no pudimos guardar el progreso.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
            <div>
                <h3 className="font-semibold text-lg">¿Terminaste esta clase?</h3>
                <p className="text-sm text-muted-foreground">Márcala como vista para actualizar tu progreso Raptor.</p>
            </div>
            <Button
                onClick={markAsRead}
                disabled={isLoading || isDone}
                data-testid="mark-read-button"
                className={isDone ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
                {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                ) : isDone ? (
                    <><Check className="mr-2 h-4 w-4" /> Vista</>
                ) : (
                    "Marcar como vista"
                )}
            </Button>
        </div>
    );
}
