"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/shared/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon-sm" aria-label="Toggle theme">
                <Sun className="w-4 h-4" />
            </Button>
        );
    }

    const isDark = theme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="relative overflow-hidden"
        >
            <Sun
                className="w-4 h-4 transition-all duration-300"
                style={{
                    transform: isDark ? "rotate(-90deg) scale(0)" : "rotate(0) scale(1)",
                    opacity: isDark ? 0 : 1,
                    position: isDark ? "absolute" : "relative",
                }}
            />
            <Moon
                className="w-4 h-4 transition-all duration-300"
                style={{
                    transform: isDark ? "rotate(0) scale(1)" : "rotate(90deg) scale(0)",
                    opacity: isDark ? 1 : 0,
                    position: isDark ? "relative" : "absolute",
                }}
            />
        </Button>
    );
}
