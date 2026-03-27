"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export type Notification = {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    read: boolean;
    type: "clase" | "simulacro" | "anuncio" | "sistema";
    url?: string;
};

const TYPE_STYLES: Record<Notification["type"], string> = {
    clase: "bg-blue-500",
    simulacro: "bg-purple-500",
    anuncio: "bg-amber-500",
    sistema: "bg-emerald-500",
};

const TYPE_LABELS: Record<Notification["type"], string> = {
    clase: "Clase",
    simulacro: "Simulacro",
    anuncio: "Anuncio",
    sistema: "Sistema",
};

interface NotificationCenterProps {
    notifications?: Notification[];
    onMarkAllRead?: () => void;
    onNotificationClick?: (notification: Notification) => void;
}

export function NotificationCenter({
    notifications: externalNotifications,
    onMarkAllRead,
    onNotificationClick,
}: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<Notification[]>(
        externalNotifications ?? []
    );
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (externalNotifications) {
            setNotifications(externalNotifications);
        }
    }, [externalNotifications]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        onMarkAllRead?.();
    }, [onMarkAllRead]);

    const handleClick = useCallback(
        (notification: Notification) => {
            setNotifications((prev) =>
                prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
            );
            onNotificationClick?.(notification);
        },
        [onNotificationClick]
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Centro de Notificaciones"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="flex flex-row items-center justify-between pr-2">
                    <SheetTitle className="text-lg">Notificaciones</SheetTitle>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-primary hover:underline font-medium"
                        >
                            Marcar todas como leídas
                        </button>
                    )}
                </SheetHeader>

                <div className="mt-4 space-y-2">
                    {notifications.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">
                                No tienes notificaciones.
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <button
                                key={notification.id}
                                onClick={() => handleClick(notification)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm",
                                    notification.read
                                        ? "bg-card opacity-60"
                                        : "bg-primary/5 border-primary/20 shadow-sm"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            "mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0",
                                            notification.read
                                                ? "bg-muted-foreground/30"
                                                : TYPE_STYLES[notification.type]
                                        )}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span
                                                className={cn(
                                                    "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                                    notification.read
                                                        ? "bg-muted text-muted-foreground"
                                                        : "bg-primary/10 text-primary"
                                                )}
                                            >
                                                {TYPE_LABELS[notification.type]}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(notification.createdAt, {
                                                    addSuffix: true,
                                                    locale: es,
                                                })}
                                            </span>
                                        </div>
                                        <p
                                            className={cn(
                                                "text-sm mt-1",
                                                notification.read
                                                    ? "text-muted-foreground"
                                                    : "font-medium text-foreground"
                                            )}
                                        >
                                            {notification.title}
                                        </p>
                                        {notification.body && (
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {notification.body}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
