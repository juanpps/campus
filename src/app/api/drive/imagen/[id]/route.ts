import { NextRequest } from "next/server";
import { driveClient } from "@/lib/drive/config";
import { Readable } from "stream";

// El SDK de Google requiere entornos Node
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    let fileId = "";
    try {
        const resolvedParams = await params;
        fileId = resolvedParams.id;
        if (!fileId) return new Response("File ID missing", { status: 400 });

        const driveResponse = await driveClient.files.get(
            { fileId: fileId, alt: "media" },
            { responseType: "stream" }
        );

        const contentType = driveResponse.headers["content-type"] || "image/jpeg";
        const stream = driveResponse.data as Readable;

        // Transformación Node Stream a Web Stream para Next.js App Router API Routes
        const webStream = new ReadableStream({
            start(controller) {
                stream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
                stream.on("end", () => controller.close());
                stream.on("error", (err: Error) => controller.error(err));
            },
            cancel() {
                stream.destroy();
            }
        });

        return new Response(webStream, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                // CDN Edge Caching: Guarda en Cloudflare/Vercel por 24h, stale-revalidate de 7 días.
                // Es vital esto para no abusar del límite (cuota) la API de Google Drive
                "Cache-Control": "public, s-maxage=86400, max-age=86400, stale-while-revalidate=604800",
            },
        });

    } catch (error) {
        console.warn(`[Proxy Drive] Imagen 404/Error ID:${fileId}. Sirviendo SVG placeholder.`, error instanceof Error ? error.message : "");
        const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"><rect fill="#18181b" width="100%" height="100%"/><text fill="#a1a1aa" x="50%" y="50%" font-family="sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">Drive 404</text></svg>`;
        return new Response(svgFallback, {
            status: 200, // Responder con 200 para prevenir que la UI rompa un tag de imagen
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "public, max-age=60",
            },
        });
    }
}
