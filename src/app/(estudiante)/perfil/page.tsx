"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, BookOpen, Target, Info } from "lucide-react";

export default function PerfilPage() {
  const [onboarding, setOnboarding] = useState(false); // Simulación de estado inicial

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-raptor/10 flex items-center justify-center border-4 border-raptor/20">
          <User className="h-10 w-10 text-raptor" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil Estudiantil</h1>
          <p className="text-muted-foreground">Estudiante Matriculado · Co-01</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              Información Personal
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estos datos son obligatorios para el seguimiento Pre-ICFES.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Nombre Completo</label>
                <p className="font-medium">Juan Manuel Pérez</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Correo Electrónico</label>
                <p className="font-medium text-primary">juan.perez@campusraptor.edu</p>
              </div>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Actualizar Perfil</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Progreso Raptor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Clases Vistas</span>
              </div>
              <span className="font-bold">12/24</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                <span className="text-sm">Simulacros</span>
              </div>
              <span className="font-bold">4/10</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-raptor w-[45%]" />
            </div>
            <p className="text-[10px] text-center text-muted-foreground italic">
              Sigue así, estás en el top 20% de tu cohorte.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Mock Overlay if needed */}
      {!onboarding && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-raptor/20 flex items-center justify-center mb-2">
                <ShieldCheck className="h-6 w-6 text-raptor" />
              </div>
              <CardTitle className="text-2xl">¡Bienvenido al Campus!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                Para aprovechar el Método Raptor al máximo, hemos preparado un tour guiado por tus nuevas herramientas.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setOnboarding(true)}>Omitir</Button>
                <Button className="flex-1 bg-raptor hover:bg-raptor/90" onClick={() => setOnboarding(true)}>Empezar Tour</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
