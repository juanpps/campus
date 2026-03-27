// Scaffolding del script de semilla para Firebase 
import { adminDb } from "../lib/firebase/admin";

const MOCK_MATERIAS = [
    {
        id: "matematicas-01",
        titulo: "Matemáticas Básicas",
        descripcion: "Fundamentos Raptor para el ICFES",
        tipo: "regular",
        // Proxy de imagenes Drive (Fase 05)
        portadaUrl: "/api/drive/imagen/1AbC2dE3fG4H5iJ6kL7mN8oP9qR0sT1uV",
        modulos: []
    },
    {
        id: "psicologia-01",
        titulo: "Preparación Psicológica",
        descripcion: "Control de estrés para el examen",
        tipo: "especial",
        portadaUrl: "/api/drive/imagen/1XyZ2dE3fG4H5iJ6kL7mN8oP9qR0sT1uV",
        articulos: []
    }
];

export async function poblarMaterias() {
    const batch = adminDb.batch();
    MOCK_MATERIAS.forEach(materia => {
        const docRef = adminDb.collection("materias").doc(materia.id);
        batch.set(docRef, materia);
    });
    await batch.commit();
    console.log("Materias sembradas con IDs de Google Drive");
}
