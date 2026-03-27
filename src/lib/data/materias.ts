import { unstable_cache } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";

export const getMateriaData = unstable_cache(
    async (materiaId: string) => {
        const docSnap = await adminDb.collection("materias").doc(materiaId).get();
        if (!docSnap.exists) return null;
        return { id: docSnap.id, ...docSnap.data() };
    },
    ['materia-data'], // key base
    {
        revalidate: 3600, // ttl 1 hora
        tags: ['materias'] // invalidación granular
    }
);
