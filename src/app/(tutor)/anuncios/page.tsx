import { AnuncioForm } from "@/components/forms/anuncios/AnuncioForm";

export default function AnunciosTutorPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Publicar Anuncio (Tutor)</h1>
        <p className="text-muted-foreground">Comunica novedades a tus grupos. Este anuncio caducará automáticamente según su Fecha de Expiración (TTL).</p>
      </div>

      <AnuncioForm autorId="tutor-demo" autorRol="tutor" />
    </div>
  );
}
