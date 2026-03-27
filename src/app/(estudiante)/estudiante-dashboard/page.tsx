"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInDays } from "date-fns";
import { BookOpen, Target, Clock } from "lucide-react";

interface EstudianteData {
  nombre: string;
  icfes_objetivo: number;
  progreso_general: number;
  cohorte_actual: string;
}

export default function EstudianteDashboard() {
  const { user } = useAuth();

  // En desarrollo usamos el dummy si no hay uid (mientras probamos UI directa)
  const uid = user?.uid || "dummy-student";
  const { data, loading, error } = useFirestoreDoc<EstudianteData>("usuarios", uid);

  // Fecha fija para el mockup del contador, idealmente vendría de cohortes/2026-I
  const EXAMEN_ICFES = new Date("2026-08-01");
  const diasRestantes = differenceInDays(EXAMEN_ICFES, new Date());

  if (error) {
    return <div className="p-4 text-red-500">Error cargando perfil: {error.message}</div>;
  }

  // Prevención ESTRICTA de CLS: Skeletons que imitan la forma del grid final
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-[8px]" />
          <Skeleton className="h-4 w-48 rounded-[8px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Hola, {data.nombre.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground">Tu dashboard de preparación ICFES.</p>
      </div>

      {/* Grid adaptativo: 3 cols en Desktop, 1 en Móvil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Widget: Contador ICFES */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cuenta Regresiva</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-raptor">{diasRestantes} días</div>
            <p className="text-xs text-muted-foreground mt-1">Para la prueba de Estado</p>
          </CardContent>
        </Card>

        {/* Widget: Progreso */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">{data.progreso_general}%</div>
            <Progress value={data.progreso_general} className="h-2" />
          </CardContent>
        </Card>

        {/* Widget: Objetivo */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Puntaje Objetivo</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.icfes_objetivo}</div>
            <p className="text-xs text-muted-foreground mt-1">Puntos aspirados</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
