"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client"; // Asumiendo que el cliente es este
import { toast } from "sonner"; // O el Toast system que se esté usando

const anuncioSchema = z.object({
    titulo: z.string().min(5, "Mínimo 5 caracteres").max(100),
    contenido: z.string().min(10, "Mínimo 10 caracteres"),
    materiaId: z.string().optional(), // Puede ser global
    ttlDias: z.coerce.number().min(1).max(30),
});

type AnuncioFormValues = z.infer<typeof anuncioSchema>;

interface Props {
    autorId: string;
    autorRol: "admin" | "tutor";
}

export function AnuncioForm({ autorId, autorRol }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AnuncioFormValues>({
        resolver: zodResolver(anuncioSchema),
        defaultValues: {
            titulo: "",
            contenido: "",
            materiaId: "",
            ttlDias: 7, // Default 1 semana
        },
    });

    const onSubmit = async (data: AnuncioFormValues) => {
        setIsLoading(true);
        try {
            const ahora = new Date();
            // Cálculo Cero-Trust del Tiempo de Vida (TTL)
            const expiracion = new Date();
            expiracion.setDate(ahora.getDate() + data.ttlDias);

            const payload = {
                titulo: data.titulo,
                contenido: data.contenido,
                autorId,
                autorRol,
                materiaId: data.materiaId || "global",
                fecha_publicacion: Timestamp.fromDate(ahora),
                fecha_expiracion: Timestamp.fromDate(expiracion),
            };

            await addDoc(collection(db, "anuncios"), payload);
            toast.success("Anuncio publicado exitosamente.");
            form.reset();
        } catch (error) {
            console.error(error);
            toast.error("Fallo de red al intentar subir el anuncio.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
            <div className="space-y-2">
                <label className="text-sm font-medium">Título del Anuncio</label>
                <input
                    {...form.register("titulo")}
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {form.formState.errors.titulo && <span className="text-destructive text-xs">{form.formState.errors.titulo.message}</span>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Mensaje</label>
                <textarea
                    {...form.register("contenido")}
                    className="w-full flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {form.formState.errors.contenido && <span className="text-destructive text-xs">{form.formState.errors.contenido.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tiempo de Vida (Días)</label>
                    <input
                        type="number"
                        {...form.register("ttlDias")}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Asignar Materia (Opcional)</label>
                    <select {...form.register("materiaId")} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="">Global / Todos</option>
                        <option value="matematicas">Matemáticas</option>
                        <option value="fisica">Física</option>
                        <option value="biologia">Biología</option>
                    </select>
                </div>
            </div>

            <button disabled={isLoading} type="submit" className="w-full h-10 mt-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {isLoading ? "Enviando Cron TTL..." : "Publicar Muro"}
            </button>
        </form>
    );
}
