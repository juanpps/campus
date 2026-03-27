import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { TopBar } from "@/components/navigation/TopBar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-background">
            {/* Navegación Desktop */}
            <Sidebar />

            {/* Contenedor Principal */}
            <div className="flex-col w-full lg:pl-64">
                {/* Barra Superior compartida */}
                <TopBar />

                {/* Contenido (con padding inferior amplio en móvil para evitar que BottomNav lo tape) */}
                <main className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8">
                    {children}
                </main>
            </div>

            {/* Navegación Móvil */}
            <BottomNav />
        </div>
    );
}
