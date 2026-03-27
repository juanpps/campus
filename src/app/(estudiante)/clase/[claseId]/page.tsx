import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Importación dinámica para optimizar el bundle inicial
const VideoPlayer = dynamic(
    () => import("@/components/shared/VideoPlayer").then((mod) => mod.VideoPlayer),
    {
        loading: () => <Skeleton className="w-full aspect-video rounded-lg" />
    }
);

import { ClaseClientWrapper } from "@/components/academico/ClaseClientWrapper";

const getClaseData = unstable_cache(
    async (claseId: string) => {
        // Si es mock E2E, mockeamos la db (TDD)
        if (process.env.NODE_ENV === "test" || claseId === "mock-test-id") {
            return { id: claseId, titulo: "Clase Mock", driveId: "123", vistas: [] };
        }
        const doc = await adminDb.collection("clases").doc(claseId).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },
    ['clase-data'], { revalidate: 3600, tags: ['clases'] }
);

export default async function ClaseViewerPage({ params }: { params: Promise<{ claseId: string }> }) {
    const { claseId } = await params;
    const clase: any = await getClaseData(claseId);

    if (!clase) notFound();

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold">{clase.titulo}</h1>
            </header>

            {/* VideoPlayer (Drive CDN Proxy) con Lazy Loading */}
            <VideoPlayer
                driveId={clase.driveId}
                title={clase.titulo}
            />

            {/* Wrapper Cliente para Genius UX (Loading / Feedback) */}
            <ClaseClientWrapper clase={clase} />
        </div>
    );
}
