"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, BookOpen, BarChart3, Settings } from "lucide-react";

const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/simulacros", icon: BookOpen, label: "Simulacros" },
    { href: "/calendario", icon: Calendar, label: "Clases" },
    { href: "/resultados", icon: BarChart3, label: "Reportes" },
    { href: "/configuracion", icon: Settings, label: "Ajustes" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r bg-background dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex h-14 items-center px-4 border-b">
                {/* Espacio para visual de marca extra si se desea, o logo */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl tracking-tight text-raptor">Campus</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid items-start px-2 text-sm font-medium gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href !== '/' ? item.href : '/___none');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-raptor ${isActive
                                        ? "bg-muted text-raptor border-l-4 border-raptor font-semibold"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-4 border-transparent"
                                    }`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <item.icon className="h-5 w-5" aria-hidden="true" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    );
}
