import { unstable_cache } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { Book } from "lucide-react";

export const dynamic = 'force-dynamic';

const getMaterias = unstable_cache(
  async () => {
    const snap = await adminDb.collection("materias").limit(10).get(); // Progressive Disclosure base limit
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  ['all-materias'], { revalidate: 3600, tags: ['materias'] }
);

export default async function MateriasGridPage() {
  const materias = await getMaterias();

  if (!materias || materias.length === 0) {
    return (
      <EmptyState
        title="No hay materias asignadas"
        description="El administrador de Raptor aún no te ha asignado contenido."
        icon={<Book className="mx-auto text-muted-foreground w-12 h-12" />}
      />
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Tus Materias</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map((m: any) => (
          <Link href={`/materias/${m.id}`} key={m.id} className="group flex flex-col hover:border-primary transition-colors border rounded-xl overflow-hidden shadow-sm">
            <div className="aspect-video relative bg-muted/30">
              <Image
                src={m.portadaUrl || `/api/drive/imagen/placeholder`}
                alt={`Portada de ${m.titulo}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <span className="text-xs uppercase font-bold text-primary mb-2">{m.tipo === "especial" ? "Lectura" : "Curso Normal"}</span>
              <h2 className="text-xl font-bold mb-2">{m.titulo}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{m.descripcion}</p>
            </div>
          </Link>
        ))}
      </div>

      {materias.length === 10 && (
        <div className="mt-12 text-center">
          <button className="px-6 py-2 border rounded-full hover:bg-muted font-medium transition-colors">
            Cargar más materias (Progressive Disclosure)
          </button>
        </div>
      )}
    </div>
  );
}
