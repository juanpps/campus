"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, Link as LinkIcon, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface DriveResourceInputProps {
    onSuccess: (resource: { type: "id" | "url"; value: string }) => void;
}

export function DriveResourceInput({ onSuccess }: DriveResourceInputProps) {
    const [activeTab, setActiveTab] = useState<"upload" | "link">("upload");
    const [loading, setLoading] = useState(false);
    const [linkValue, setLinkValue] = useState("");
    const [uploaded, setUploaded] = useState(false);

    // Extractor de ID
    const extractDriveId = (url: string) => {
        const match = url.match(/[-\w]{25,}/);
        return match ? match[0] : null;
    };

    const handleLinkSubmit = () => {
        if (!linkValue) return;
        const driveId = extractDriveId(linkValue);

        if (driveId && linkValue.includes("drive.google.com")) {
            onSuccess({ type: "id", value: driveId });
            toast.success("ID de Drive extraído correctamente.");
        } else {
            onSuccess({ type: "url", value: linkValue });
            toast.success("Enlace externo registrado.");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setUploaded(false);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/drive/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error al subir archivo");

            toast.success("Archivo subido a Google Drive exitosamente");
            setUploaded(true);
            onSuccess({ type: "id", value: data.fileId });

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
            // Resetear el input file para permitir volver a elegir el mismo
            e.target.value = '';
        }
    };

    return (
        <div className="w-full max-w-md border rounded-[10px] p-1 bg-background">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "link")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="upload" className="flex gap-2">
                        <UploadCloud className="h-4 w-4" /> Subir Archivo
                    </TabsTrigger>
                    <TabsTrigger value="link" className="flex gap-2">
                        <LinkIcon className="h-4 w-4" /> Pegar Enlace
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="p-4 rounded-lg bg-muted/40 border border-dashed flex flex-col items-center justify-center min-h-[120px]">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-raptor" />
                            <span className="text-sm">Subiendo de forma segura a Drive...</span>
                        </div>
                    ) : uploaded ? (
                        <div className="flex flex-col items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-8 w-8" />
                            <span className="text-sm font-medium">Carga Completada</span>
                        </div>
                    ) : (
                        <>
                            <Label
                                htmlFor="drive-upload"
                                className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center">
                                    <UploadCloud className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">Click o arrastra un archivo PDF/Video</span>
                            </Label>
                            <Input
                                id="drive-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept="application/pdf,video/mp4,video/x-m4v,video/*,image/*"
                            />
                        </>
                    )}
                </TabsContent>

                <TabsContent value="link" className="space-y-4 pt-2 px-1">
                    <div className="space-y-2">
                        <Label htmlFor="resource-link">URL del documento o video</Label>
                        <div className="flex gap-2">
                            <Input
                                id="resource-link"
                                placeholder="https://drive.google.com/file/d/..."
                                value={linkValue}
                                onChange={(e) => setLinkValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLinkSubmit()}
                            />
                            <Button onClick={handleLinkSubmit} className="shrink-0 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 border-0">
                                Añadir
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Extraeremos el ID automáticamente si el enlace pertenece a Google Drive.
                    </p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
