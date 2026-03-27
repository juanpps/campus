// ──────────────────────────────────────
// Tipos de Usuario — Campus Raptor
// ──────────────────────────────────────

export type UserRole = "estudiante" | "tutor" | "admin" | "superadmin";
export type UserStatus = "activo" | "congelado" | "baneado";

export interface RaptorUser {
    uid: string;
    nombre: string;
    correo: string;
    rol: UserRole;
    foto_perfil: string;
    materia_asignada?: string[];
    fecha_registro: Date;
    estado: UserStatus;
    cohorte_id: string;
    departamento: string;
    municipio: string;
    documento: string;
    telefono: string;
    fcm_token?: string;
}
