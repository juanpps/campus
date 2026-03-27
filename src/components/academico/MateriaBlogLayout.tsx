"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen } from "lucide-react";

interface Props {
    materia: any;
}

export function MateriaBlogLayout({ materia }: Props) {
    return (
        <article className="max-w-4xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12 text-center">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase mb-2 block">
                    Lectura Especial
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">{materia.titulo}</h1>
                <p className="text-xl text-muted-foreground">{materia.descripcion}</p>
            </header>

            <div className="prose prose-lg dark:prose-invert mx-auto">
                {materia.articulos && materia.articulos.length > 0 ? (
                    materia.articulos.map((art: any, i: number) => (
                        <section key={i} className="mb-8">
                            <h2>{art.titulo}</h2>
                            <p>{art.contenido}</p>
                        </section>
                    ))
                ) : (
                    <EmptyState
                        title="Próximamente"
                        description="Los primeros artículos de psicología se habilitarán pronto."
                        icon={<BookOpen className="h-12 w-12 text-muted-foreground/50" />}
                    />
                )}
            </div>
        </article>
    );
}
