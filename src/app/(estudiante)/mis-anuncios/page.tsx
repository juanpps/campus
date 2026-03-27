"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type AnuncioType = {
  id: string;
  titulo: string;
  contenido: string;
  autorRol: "admin" | "tutor";
  materiaId: string;
  fecha_publicacion: Timestamp;
  fecha_expiracion: Timestamp;
};

export default function MuroAnunciosPage() {
  const [anuncios, setAnuncios] = useState<AnuncioType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escudo Zero-Trust: Filtrado Activo en Cliente por seguridad
    const ahora = Timestamp.now();
    const q = query(
      collection(db, "anuncios"),
      where("fecha_expiracion", ">", ahora),
      // orderBy("fecha_publicacion", "desc") // Requiere índice en Firebase, lo omitimos para quick-start o usar ordenamiento local
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnuncioType));
      // Sort en cliente para evitar creación manual de índice en Firestore (optimización temprana)
      data.sort((a, b) => b.fecha_publicacion.toMillis() - a.fecha_publicacion.toMillis());
      setAnuncios(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getCardStyle = (anuncio: AnuncioType) => {
    if (anuncio.autorRol === "admin") {
      // Heurística Genius: Destacar Admin
      return "border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10 shadow-md ring-1 ring-amber-500/20";
    }

    // Anuncios de Materias Comunes
    if (anuncio.materiaId === "matematicas") return "border-blue-500 bg-blue-500/5";
    if (anuncio.materiaId === "fisica") return "border-orange-500 bg-orange-500/5";
    return "border-border bg-card";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Muro de Comunicaciones</h1>
        <p className="text-muted-foreground">Mantente al día con notificaciones en tiempo real del campus temporal.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded-xl animate-pulse" />
            <div className="h-32 bg-muted rounded-xl animate-pulse delay-75" />
          </div>
        ) : anuncios.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
            <h3 className="text-lg font-medium">Buzón Vacío</h3>
            <p className="text-muted-foreground text-sm mt-1">El Cron Job purga los anuncios expirados automáticamente. No hay comunicados recientes.</p>
          </div>
        ) : (
          anuncios.map(anuncio => (
            <div key={anuncio.id} className={cn("rounded-xl border p-5 transition-all hover:shadow-md", getCardStyle(anuncio))}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {anuncio.autorRol === "admin" ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider">
                      Raptor Core
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium uppercase">
                      {anuncio.materiaId}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {format(anuncio.fecha_publicacion.toDate(), "dd MMM, hh:mm a", { locale: es })}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{anuncio.titulo}</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{anuncio.contenido}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
