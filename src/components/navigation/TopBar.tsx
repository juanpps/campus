"use client";

import { useTheme } from "next-themes";
import { useUIStore } from "@/stores/theme-store";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { NotificationCenter } from "@/components/shared/NotificationCenter";

export function TopBar() {
    const { setTheme, theme } = useTheme();
    // Sincronización del store con la interfaz de persistencia si es necesario,
    // pero next-themes se encarga de inyectar correctamente la clase en html.

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    {/* Logo Raptor responsivo */}
                    <div className="h-8 w-8 rounded-[10px] bg-raptor flex items-center justify-center font-bold text-white text-lg select-none" aria-hidden="true">
                        🦖
                    </div>
                    <span className="font-semibold text-lg hidden sm:inline-block">Método Raptor</span>
                </div>

                <div className="flex items-center space-x-2">
                    <NotificationCenter />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-11 h-11 rounded-[10px]" // Touch target >= 44x44
                        aria-label="Alternar tema"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    {/* User Profile Hook placeholder */}
                    <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center" aria-label="Perfil de usuario" role="button" tabIndex={0}>
                        <span className="text-sm font-medium">MR</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
