"use client";

import dynamic from "next/dynamic";

const SharedCalendar = dynamic(() => import("@/components/shared/Calendar").then(mod => mod.SharedCalendar), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full animate-pulse bg-muted rounded-xl" />
});

const MOCK_EVENTS = [
  { id: "1", date: new Date(), title: "Calificar Ensayos Grupo A", materiaColor: "bg-blue-500" },
  { id: "2", date: new Date(new Date().setDate(new Date().getDate() + 1)), title: "Reunión de Facultad", materiaColor: "bg-amber-500" },
];

export default function CalendarioTutorPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Agenda del Tutor</h1>
        <p className="text-muted-foreground">Gestiona tus clases en vivo y tiempos de revisión.</p>
      </div>

      <div className="mt-8">
        <SharedCalendar events={MOCK_EVENTS} />
      </div>
    </div>
  );
}
