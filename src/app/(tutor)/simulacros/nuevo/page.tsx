"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Esquema Zod dinámico. La validación del array se adapta al numPreguntas.
const simulacroSchema = z.object({
    titulo: z.string().min(5, "Título muy corto"),
    archivoDriveId: z.string().min(10, "ID de Google Drive inválido"),
    numPreguntas: z.coerce.number().min(1).max(200),
    claves: z.array(z.enum(["A", "B", "C", "D"], { required_error: "Debes seleccionar una opción válida" }))
});

type FormValues = z.infer<typeof simulacroSchema>;

export default function NuevoSimulacroPage() {
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(simulacroSchema),
        defaultValues: {
            titulo: "", archivoDriveId: "", numPreguntas: 10, claves: Array(10).fill("A")
        }
    });

    const numPreguntas = watch("numPreguntas") || 0;

    // Reactivity: Actualizar tamaño del array si el número cambia
    const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 0;
        setValue("numPreguntas", val);
        setValue("claves", Array(val).fill("A")); // Reset a 'A'
    };

    const onSubmit = async (data: FormValues) => {
        try {
            // API call (simulada para E2E testing)
            await new Promise(res => setTimeout(res, 1500));
            // POST /api/simulacros/crear (Aquí iría el endpoint real codificado en Tech Lead)
            toast.success("Patrón de claves criptográficas resguardado en bóveda.");
        } catch {
            toast.error("Raptorcito, el servidor rechazó las claves. Intenta de nuevo.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Nuevo Simulacro y Claves</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 rounded-xl border">

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Título</label>
                        <input {...register("titulo")} className="w-full flex h-10 rounded-md border px-3" />
                        {errors.titulo && <span className="text-xs text-destructive">{errors.titulo.message}</span>}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Drive PDF ID</label>
                        <input {...register("archivoDriveId")} className="w-full flex h-10 rounded-md border px-3" />
                        {errors.archivoDriveId && <span className="text-xs text-destructive">{errors.archivoDriveId.message}</span>}
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium">Número de Preguntas</label>
                    <input type="number" min="1" max="200" value={numPreguntas} onChange={handleNumChange} className="w-full flex h-10 rounded-md border px-3" />
                </div>

                {/* Generador de Radios dinámico */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: numPreguntas }).map((_, idx) => (
                        <div key={idx} className="p-3 border rounded-md bg-muted/40">
                            <span className="font-bold text-sm block mb-2">P{idx + 1}</span>
                            <div className="flex space-x-2">
                                {["A", "B", "C", "D"].map(opt => (
                                    <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                                        <input type="radio" value={opt} {...register(`claves.${idx}` as const)} className="accent-primary" />
                                        <span className="text-sm">{opt}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.claves?.[idx] && <span className="text-[10px] text-destructive block mt-1">Requerida</span>}
                        </div>
                    ))}
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full h-12 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 disabled:opacity-50">
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 inline animate-spin" /> Guardando...</> : "Guardar Simulacro Seguro"}
                </button>
            </form>
        </div>
    );
}
