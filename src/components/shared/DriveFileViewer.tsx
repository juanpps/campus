import { Skeleton } from "@/components/ui/skeleton";

interface DriveFileViewerProps {
    fileId: string;
    title?: string;
    className?: string;
}

export function DriveFileViewer({ fileId, title = "Documento PDF", className = "" }: DriveFileViewerProps) {
    if (!fileId) return <Skeleton className="w-full h-[600px] rounded-lg" />;

    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

    return (
        <div className={`relative w-full overflow-hidden rounded-lg border bg-muted/20 ${className}`}>
            {/* Skeleton de fondo visible solo mientra el iframe carga o se pinta */}
            <Skeleton className="absolute inset-0 z-0 h-full w-full" />
            <iframe
                src={previewUrl}
                className="relative z-10 w-full h-[600px] border-0"
                title={title}
                loading="lazy"
                allow="autoplay; encrypted-media" // Prevención de scripts no deseados, sin allow-scripts si no es estrictamente necesario
                allowFullScreen
            ></iframe>
        </div>
    );
}
