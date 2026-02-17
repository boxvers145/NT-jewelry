"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils";
import { useTransitionStore } from "@/shared/stores/transition-store";
import { MagneticButton } from "@/shared/ui/magnetic-button";

interface AccessButtonProps {
    className?: string;
}

export function AccessButton({ className }: AccessButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { startTransition, endTransition, setIsExiting } = useTransitionStore();

    const handlePlay = (e: React.MouseEvent) => {
        e.preventDefault();

        // Don't trigger if already on game page
        if (pathname === "/game") return;

        // 1. Start "Cover" animation (polygons enter)
        startTransition();

        // 2. Wait for cover to be full (approx 600ms matching duration)
        setTimeout(() => {
            // 3. Navigate while covered
            router.push("/game");

            // Wait for new page to load (simulated delay to hide loading/rendering)
            setTimeout(() => {
                // 4. Start "Reveal" animation (polygons exit)
                setIsExiting(true);

                // 5. Cleanup after reveal is done
                setTimeout(() => {
                    endTransition();
                }, 700);
            }, 700);

        }, 600);
    };

    return (
        <MagneticButton strength={0.2} onClick={handlePlay} className={className}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "relative group flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-primary/30 hover:border-primary transition-colors overflow-hidden",
                    // No extra className here, it's on the wrapper
                )}
            >
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />

                {/* Pulsing Gem Core */}
                <div className="relative">
                    <Sparkles className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    <span className="absolute inset-0 animate-ping opacity-75 rounded-full bg-primary h-full w-full -z-10 group-hover:opacity-100" />
                </div>
            </motion.button>
        </MagneticButton>
    );
}
