"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useUIStore } from "@/stores/theme-store";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    const { theme } = useUIStore();

    return (
        <NextThemesProvider
            forcedTheme={theme !== 'system' ? theme : undefined}
            enableSystem={true}
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}
