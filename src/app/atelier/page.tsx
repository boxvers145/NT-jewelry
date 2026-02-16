"use client";

import { PageTransition } from "@/shared/lib/page-transition";
import { CraftingInterface } from "@/features/game-ui/crafting-interface";
import { motion } from "framer-motion";

export default function AtelierPage() {
    return (
        <PageTransition>
            <div className="min-h-screen relative flex flex-col pt-20 pb-20 overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 bg-[#050505] z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40 z-0" />

                {/* Animated Particles/Sparks */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 flex-1 flex flex-col justify-center">
                    <CraftingInterface />
                </div>
            </div>
        </PageTransition>
    );
}
