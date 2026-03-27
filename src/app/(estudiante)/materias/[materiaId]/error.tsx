"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // Asumido

export default function MateriaError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Reporte analítico de error
        console.error("ErrorBoundary Raptorcito:", error);
        toast.error("Raptorcito, ocurrió un error cargando el contenido.");
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Ups! Algo salió mal</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                No pudimos cargar esta materia. Nuestro equipo ya ha sido notificado del fallo.
            </p>
            <Button onClick={() => reset()} variant="default">
                Intentar nuevamente
            </Button>
        </div>
    );
}
