// ──────────────────────────────────────
// Tipos de Simulacro — Campus Raptor
// ──────────────────────────────────────

export type SimulacroEstado = "borrador" | "publicado" | "cerrado";

export interface Pregunta {
    id: string;
    enunciado: string;
    imagen_url?: string;
    opciones: {
        a: string;
        b: string;
        c: string;
        d: string;
    };
}

/** La clave de respuestas NUNCA se expone al cliente.
 *  Se almacena en sub-colección privada con regla `allow read: if false`. */
export interface ClaveRespuestas {
    [pregunta_id: string]: "a" | "b" | "c" | "d";
}

export interface Simulacro {
    id: string;
    titulo: string;
    materia_id: string;
    preguntas: Pregunta[];
    estado: SimulacroEstado;
    duracion_minutos: number;
    fecha_publicacion?: Date;
    fecha_cierre?: Date;
    creado_por: string;
}

export interface ResultadoSimulacro {
    id: string;
    simulacro_id: string;
    estudiante_id: string;
    respuestas: { [pregunta_id: string]: "a" | "b" | "c" | "d" };
    puntaje: number;
    total_preguntas: number;
    porcentaje: number;
    fecha_presentacion: Date;
}
