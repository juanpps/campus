import { AnuncioForm } from "@/components/forms/anuncios/AnuncioForm";

export default function AnunciosAdminPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Publicar Nuevo Anuncio (Raptor Core)</h1>
        <p className="text-muted-foreground">Envía un comunicado global o de materia. Este anuncio se auto-destruirá de Firestore al superar su TTL paramétrico para ahorrar costos de Spark.</p>
      </div>

      <AnuncioForm autorId="god-admin" autorRol="admin" />
    </div>
  );
}
