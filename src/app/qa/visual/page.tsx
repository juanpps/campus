import fs from 'fs';
import path from 'path';

// En un entorno de Next.js App Router puro (Build static) importar 'fs' es delicado
// Lo encapsulamos en una página Renderizada Dinámicamente para consumo interno de God Mode
export const dynamic = 'force-dynamic';

export default async function QAVisualDashboard() {
    const screenshotsDir = path.join(process.cwd(), 'public', 'docs', 'screenshots');
    let images: string[] = [];

    try {
        if (fs.existsSync(screenshotsDir)) {
            images = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
        }
    } catch (e) { /* ignore */ }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
            <header className="border-b pb-4">
                <h1 className="text-3xl font-black flex items-center gap-2">
                    <span>👀</span> God Mode QA Visual Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                    Radiografías generadas por Playwright (Aislado de producción). Visión automatizada de los componentes MOCKEADOS.
                </p>
            </header>

            {images.length === 0 ? (
                <div className="p-12 text-center bg-muted/30 border-dashed border-2 rounded-xl">
                    Aún no se ha ejecutado el pipeline `npx playwright test scripts/capture-ui.ts`.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {images.map(img => (
                        <div key={img} className="border rounded-lg bg-card shadow-sm flex flex-col overflow-hidden group">
                            <div className="bg-primary/10 px-4 py-2 border-b">
                                <h3 className="font-mono text-xs font-bold truncate">{img}</h3>
                            </div>
                            <div className="p-4 flex-1">
                                {/* Visualizamos la snapshot (no optimizada) */}
                                <div className="aspect-[16/10] relative bg-black/5 rounded-md overflow-hidden ring-1 ring-border group-hover:scale-[1.02] transition-transform">
                                    <img
                                        src={`/docs/screenshots/${img}`}
                                        alt={img}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
