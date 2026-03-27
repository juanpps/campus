"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

// Validación Regex estricta requerida por AntiGravity
const recursoRegex = /^(https?:\/\/(www\.)?(drive\.google\.com|youtube\.com|youtu\.be)\/.+)$/;

const claseSchema = z.object({
    titulo: z.string().min(5, "El título debe tener al menos 5 caracteres"),
    descripcion: z.string().min(10, "Añade una descripción más detallada"),
    recursoUrl: z.string().regex(recursoRegex, "Debe ser un enlace válido de Google Drive o YouTube"),
});

type ClaseFormValues = z.infer<typeof claseSchema>;

export default function NuevaClasePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ClaseFormValues>({
        resolver: zodResolver(claseSchema),
    });

    const onSubmit = async (data: ClaseFormValues) => {
        setIsSubmitting(true);
        try {
            // Fake delay: Simulación de Firebase Admin SDK
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success("¡Clase creada exitosamente! Los estudiantes ya pueden verla.");
        } catch (error) {
            toast.error("Raptorcito, ocurrió un error guardando la clase.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 animate-in fade-in zoom-in-95">
            <h1 className="text-3xl font-bold mb-6">Crear Nueva Clase</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Título de la Clase</label>
                    <input
                        {...register("titulo")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ej: Ecuaciones de 2do Grado"
                    />
                    {errors.titulo && <span className="text-sm text-destructive">{errors.titulo.message}</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Descripción</label>
                    <textarea
                        {...register("descripcion")}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Detalla lo que aprenderán en esta sesión..."
                    />
                    {errors.descripcion && <span className="text-sm text-destructive">{errors.descripcion.message}</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">URL de Drive o YouTube</label>
                    <input
                        {...register("recursoUrl")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="https://drive.google.com/..."
                    />
                    {errors.recursoUrl && <span className="text-sm text-destructive">{errors.recursoUrl.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                >
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando en Firestore...</> : "Publicar Clase"}
                </button>
            </form>
        </div>
    );
}
