"use client";

import * as React from "react";
import { Calendar as BaseCalendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

export type CalendarEvent = {
    id: string;
    date: Date;
    title: string;
    materiaColor?: string; // e.g. "bg-red-500"
};

interface CustomCalendarProps {
    events?: CalendarEvent[];
    onDateSelect?: (date: Date | undefined) => void;
    className?: string;
}

export function SharedCalendar({ events = [], onDateSelect, className }: CustomCalendarProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (onDateSelect) onDateSelect(selectedDate);
    };

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6", className)}>
            {/* Visualización del calendario completo adaptable */}
            <div className="bg-card w-full border rounded-xl p-4 shadow-sm md:block hidden">
                <BaseCalendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    locale={es}
                    className="w-full flex justify-center"
                    classNames={{
                        months: "w-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "w-full space-y-4",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full justify-between",
                        row: "flex w-full mt-2 justify-between",
                        cell: "text-center w-full relative p-0 hover:bg-muted focus-within:relative focus-within:z-20",
                        day: "h-10 w-full p-0 font-normal aria-selected:opacity-100 rounded-md",
                    }}
                    components={{
                        DayContent: ({ date: dayDate }) => {
                            const dayEvents = events.filter(e => isSameDay(e.date, dayDate));
                            return (
                                <div className="flex flex-col items-center justify-center w-full h-full p-1 relative">
                                    <span>{format(dayDate, "d")}</span>
                                    {dayEvents.length > 0 && (
                                        <div className="flex gap-1 absolute bottom-1">
                                            {dayEvents.slice(0, 3).map((evt, i) => (
                                                <div
                                                    key={i}
                                                    className={cn("w-1.5 h-1.5 rounded-full", evt.materiaColor || "bg-primary")}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    }}
                />
                <div className="mt-4 flex gap-4 text-xs text-muted-foreground justify-center">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Matemáticas</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Física</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Biología</div>
                </div>
            </div>

            {/* Lista colapsada para MÓVIL (oculta en md) y Panel Lateral en PC */}
            <div className="flex flex-col gap-4">
                <div className="md:hidden flex justify-between items-center bg-card p-4 rounded-xl shadow-sm border">
                    <h3 className="font-semibold text-lg">{date ? format(date, "MMMM d, yyyy", { locale: es }) : "Eventos del día"}</h3>
                    <span className="text-sm text-primary cursor-pointer hover:underline">Ver Mes</span>
                </div>

                <div className="bg-card border rounded-xl p-4 shadow-sm flex-1">
                    <h4 className="font-bold mb-4">{date ? 'Agenda del ' + format(date, "d 'de' MMMM", { locale: es }) : 'Próximos Eventos'}</h4>
                    <div className="space-y-3">
                        {events.filter(e => date && isSameDay(e.date, date)).length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Sin eventos agendados.</p>
                        ) : (
                            events.filter(e => date && isSameDay(e.date, date)).map(evt => (
                                <div key={evt.id} className="p-3 border rounded-lg text-sm flex items-center gap-3">
                                    <div className={cn("w-3 h-3 rounded-full flex-shrink-0", evt.materiaColor || "bg-primary")} />
                                    <p className="font-medium">{evt.title}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
