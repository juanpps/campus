// ──────────────────────────────────────
// Tipos Académicos — Campus Raptor
// ──────────────────────────────────────

export interface Materia {
    id: string;
    nombre: string;
    descripcion: string;
    icono: string;
    color: string;
    tutor_ids: string[];
    activa: boolean;
}

export interface Clase {
    id: string;
    materia_id: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
    enlace_meet?: string;
    recursos_ids: string[];
    grabacion_url?: string;
}
