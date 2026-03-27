"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Clock } from "lucide-react";

export default function SplitViewVisorPage() {
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hora
    const [isSubmitting, setIsSubmitting] = useState(false);

    // En un caso real estos vendrían de props o SWR
    const numPreguntas = 15;
    const [respuestas, setRespuestas] = useState<string[]>(Array(numPreguntas).fill(""));

    useEffect(() => {
        if (timeLeft <= 0) {
            handleAutoSubmit();
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAutoSubmit = async () => {
        toast.error("El tiempo se ha agotado. Enviando prueba automáticamente...", { duration: 5000 });
        await forceSubmit();
    };

    const forceSubmit = async () => {
        setIsSubmitting(true);
        // POST /api/simulacros/calificar
        await new Promise(r => setTimeout(r, 2000));
        toast.success("¡Simulacro evaluado con éxito!");
        setIsSubmitting(false);
    };

    const isDanger = timeLeft <= 300; // < 5 mins
    const formatTime = (secs: number) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-background animate-in slide-in-from-bottom-4">
            {/* 50% Izquierda: Visor PDF de Google Drive */}
            <div className="flex-1 lg:w-1/2 h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r relative">
                <iframe
                    className="w-full h-full"
                    src="/api/drive/imagen/mock-pdf-id?type=pdf"
                    title="Cuadernillo ICFES"
                />
                {/* Timer UI Overlay Top-Right (Heurística de estrés controlada) */}
                <div className={`absolute top-4 right-4 z-10 px-4 py-2 rounded-full font-bold shadow-lg flex items-center bg-background/90 backdrop-blur-md border 
          ${isDanger ? "text-destructive border-destructive animate-pulse" : "text-foreground"}
        `}>
                    <Clock className="w-5 h-5 mr-2" />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* 50% Derecha: Formulario Scrollable de Respuestas */}
            <div className="w-full lg:w-[400px] xl:w-[500px] flex flex-col h-[50vh] lg:h-full bg-muted/20">
                <div className="p-6 border-b bg-background shadow-sm z-10">
                    <h2 className="text-xl font-bold">Hoja de Respuestas</h2>
                    <p className="text-sm text-muted-foreground">Selecciona la opción correcta</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {Array.from({ length: numPreguntas }).map((_, idx) => (
                        <div key={idx} className="p-4 bg-background border rounded-lg hover:border-primary transition-colors">
                            <span className="font-bold mb-3 block border-b pb-2">Pregunta {idx + 1}</span>
                            <div className="flex justify-between px-2">
                                {["A", "B", "C", "D"].map(opt => (
                                    <button
                                        key={opt}
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            const newArr = [...respuestas];
                                            newArr[idx] = opt;
                                            setRespuestas(newArr);
                                        }}
                                        className={`h-12 w-12 rounded-full font-bold transition-all border-2 
                      ${respuestas[idx] === opt
                                                ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md"
                                                : "bg-transparent text-muted-foreground border-muted-foreground/30 hover:border-primary/50"}
                    `}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t bg-background">
                    <button
                        disabled={isSubmitting}
                        onClick={forceSubmit}
                        data-testid="submit-simulacro"
                        className="w-full h-14 rounded-xl font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                        {isSubmitting ? <><Loader2 className="h-6 w-6 animate-spin mr-2" /> Evaluando en el Servidor...</> : "ENTREGAR PRUEBA"}
                    </button>
                </div>
            </div>
        </div>
    );
}
