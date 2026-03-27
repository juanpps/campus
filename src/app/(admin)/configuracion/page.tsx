"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function ConfiguracionPage() {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCohort = () => {
    if (confirmText !== "CONFIRMAR") return;
    setIsDeleting(true);
    // Simulación de borrado destructivo
    setTimeout(() => {
      alert("Cohorte eliminada permanentemente.");
      setIsDeleting(false);
      setConfirmText("");
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona los ajustes globales y operaciones críticas de la plataforma.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Sección de Peligro */}
        <section className="border-destructive/20 border rounded-xl overflow-hidden">
          <div className="bg-destructive/10 p-4 border-b border-destructive/20 flex items-center gap-3">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <h2 className="font-semibold text-destructive">Zona de Peligro</h2>
          </div>
          <div className="p-6 bg-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">Eliminar Cohorte Actual</p>
                <p className="text-sm text-muted-foreground">
                  Esta acción borrará permanentemente a TODOS los estudiantes y resultados de la cohorte activa.
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="shrink-0">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Borrar Cohorte
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Para proceder, escriba <span className="font-bold text-foreground">CONFIRMAR</span> a continuación.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Escriba aquí..."
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText("")}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={confirmText !== "CONFIRMAR" || isDeleting}
                      onClick={handleDeleteCohort}
                      className="bg-destructive hover:bg-destructive/90 text-white"
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar permanentemente"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </section>

        {/* Otros Ajustes */}
        <section className="border rounded-xl p-6 bg-card space-y-4">
          <h2 className="text-xl font-semibold">Ajustes Generales</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Registro de Estudiantes</p>
                <p className="text-sm text-muted-foreground">Permitir que nuevos estudiantes se unan vía link invitado.</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full relative">
                <div className="h-5 w-5 bg-white rounded-full absolute right-0.5 top-0.5" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
