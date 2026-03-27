"use client";

import { useEffect, useState } from "react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfigGeneral {
    banner_modal_activo: boolean;
    banner_titulo: string;
    banner_mensaje: string;
}

export function BannerModal() {
    const { data, loading, error } = useFirestoreDoc<ConfigGeneral>("config", "general");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Si la garga terminó, no hay error y el banner está activo, lo abrimos
        if (!loading && !error && data?.banner_modal_activo) {
            // Verificamos si ya se cerró en esta sesión para no ser molestos
            const dismissed = sessionStorage.getItem("bannerDismissed");
            if (!dismissed) {
                setOpen(true);
            }
        }
    }, [data, loading, error]);

    const handleClose = () => {
        setOpen(false);
        sessionStorage.setItem("bannerDismissed", "true");
    };

    if (loading || error || !data?.banner_modal_activo) return null;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent className="sm:max-w-md border-raptor-amber/30">
                <DialogHeader>
                    <DialogTitle className="text-xl text-raptor">{data.banner_titulo}</DialogTitle>
                    <DialogDescription className="pt-2 text-foreground/80">
                        {data.banner_mensaje}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end pt-4">
                    <Button onClick={handleClose}>Entendido</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
