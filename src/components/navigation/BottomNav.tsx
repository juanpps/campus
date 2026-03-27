"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, BookOpen, BarChart3, Settings } from "lucide-react";

// Máximo 5 ítems como lo dicta la skill ui-ux-pro-max
const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/simulacros", icon: BookOpen, label: "Simulacros" },
    { href: "/calendario", icon: Calendar, label: "Clases" },
    { href: "/resultados", icon: BarChart3, label: "Reportes" },
    { href: "/configuracion", icon: Settings, label: "Ajustes" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 z-50 flex w-full justify-around border-t bg-background pb-safe lg:hidden shadow-none dark:border-zinc-800">
            {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href !== '/' ? item.href : '/___none');
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        // Touch targets mínimo 44x44pt y padding seguro
                        className={`flex flex-col items-center justify-center w-full min-h-[56px] min-w-[44px] gap-1 p-2 transition-colors ${isActive
                                ? "text-raptor"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                        <span className="text-[10px] font-medium leading-none">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
