interface VideoPlayerProps {
    url?: string;
    driveId?: string;
    title?: string;
    className?: string;
}

export function VideoPlayer({ url, driveId, title = "Video", className = "" }: VideoPlayerProps) {
    let embedUrl = "";

    if (driveId) {
        embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
    } else if (url) {
        // Extracción simple de ID de Youtube
        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
        if (ytMatch && ytMatch[1]) {
            embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
        } else {
            embedUrl = url; // Fallback
        }
    }

    if (!embedUrl) return null;

    return (
        <div className={`relative w-full overflow-hidden rounded-[10px] aspect-video border bg-black ${className}`}>
            <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                title={title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}
