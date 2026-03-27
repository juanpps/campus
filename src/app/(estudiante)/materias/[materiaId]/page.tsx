import { notFound } from "next/navigation";
import { getMateriaData } from "@/lib/data/materias";
import { MateriaTabsLayout } from "@/components/academico/MateriaTabsLayout";
import { MateriaBlogLayout } from "@/components/academico/MateriaBlogLayout";

// Componente Factory: Encamina la UI dependiendo de la metadada (Genius UX)
export default async function MateriaFactoryPage({ params }: { params: Promise<{ materiaId: string }> }) {
    const resolvedParams = await params;
    const materia: any = await getMateriaData(resolvedParams.materiaId);

    if (!materia) {
        notFound();
    }

    // Patrón Factory puro para dividir flujos visuales
    return (
        <div className="w-full max-w-7xl mx-auto">
            {materia.tipo === "especial" ? (
                <MateriaBlogLayout materia={materia} />
            ) : (
                <MateriaTabsLayout materia={materia} />
            )}
        </div>
    );
}
