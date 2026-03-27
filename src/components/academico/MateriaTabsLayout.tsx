"use client";

import { useState } from "react";
// Importar Skeletons (Asumidos en fase 03/04)
import { EmptyState } from "@/components/shared/EmptyState";

interface Props {
    materia: any;
}

// TODO: usar ui/tabs de shadcn (simulado en el scope).
export function MateriaTabsLayout({ materia }: Props) {
    const [activeTab, setActiveTab] = useState("clases");

    const tabs = ["clases", "simulacros", "actividades", "recursos", "anuncios"];

    return (
        <div className="w-full animate-in fade-in zoom-in-95 duration-300">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">{materia.titulo}</h1>
                <p className="text-muted-foreground">{materia.descripcion}</p>
            </header>

            {/* Navegación Shadcn Simulada */}
            <div className="flex space-x-2 border-b mb-6 overflow-x-auto pb-safe">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 capitalize font-medium transition-colors ${activeTab === tab
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {/* Placeholder rendering until data connections are established */}
                <EmptyState title={`No hay ${activeTab} registrados`} description={`Aún no subimos contenido de ${activeTab} para esta materia.`} />
            </div>

        </div>
    );
}
