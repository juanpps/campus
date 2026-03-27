"use client";

import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export function EmptyState({
    title = "No hay contenido disponible",
    description = "Aún no se ha asignado contenido a esta sección.",
    icon = <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 border-2 border-dashed rounded-[10px] min-h-[300px]">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">{description}</p>
        </div>
    );
}
