"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

const mockProgresoData = [
  { mes: "Ene", puntaje: 280 },
  { mes: "Feb", puntaje: 295 },
  { mes: "Mar", puntaje: 310 },
  { mes: "Abr", puntaje: 335 },
  { mes: "May", puntaje: 350 },
  { mes: "Jun", puntaje: 362 },
];

const chartConfig = {
  puntaje: {
    label: "Puntaje Promedio",
    theme: {
      light: "hsl(var(--raptor))",
      dark: "hsl(var(--raptor))",
    },
  },
};

interface CohorteData {
  nombre: string;
  estudiantes_inscritos: number;
}

export default function AdminDashboard() {
  const { data, loading, error } = useFirestoreDoc<CohorteData>("cohortes", "2026-I");

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  // Refactorización Activa: Skeletons precisos evitando desbordes o saltos
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground">Monitoreo de la cohorte actual ({data.nombre})</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Rendimiento General (Simulacros)</CardTitle>
            <CardDescription>
              Crecimiento del puntaje promedio de los {data.estudiantes_inscritos} estudiantes de la cohorte.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            {/* Responsive Container asegurará que Recharts se adapte al Grid de Tailwind en móvil y desktop */}
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <AreaChart
                    accessibilityLayer
                    data={mockProgresoData}
                    margin={{ left: 12, right: 12 }}
                  >
                    <CartesianGrid vertical={false} strokeOpacity={0.2} />
                    <XAxis
                      dataKey="mes"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Area
                      dataKey="puntaje"
                      type="natural"
                      fill="var(--color-puntaje)"
                      fillOpacity={0.4}
                      stroke="var(--color-puntaje)"
                    />
                  </AreaChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Más widgets administrativos delegados irían aquí */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Operaciones Críticas</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex items-center justify-center h-[250px] border-2 border-dashed rounded-lg">
            Widget en construcción (Asignación de Tutores)
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
