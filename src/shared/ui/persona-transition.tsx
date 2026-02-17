"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransitionStore } from "@/shared/stores/transition-store";

export function PersonaTransition() {
    const { isActive, isExiting } = useTransitionStore();

    return (
        <AnimatePresence>
            {(isActive || isExiting) && (
                <div className="fixed inset-0 z-[99999] pointer-events-none flex flex-col justify-center items-center overflow-hidden">
                    {/* Black Polygons */}
                    <motion.div
                        className="absolute inset-0 bg-black rotate-[-15deg] scale-150 origin-center"
                        initial={{ x: "-100%", skewX: 20 }}
                        animate={{ x: isExiting ? "100%" : "0%", skewX: 0 }}
                        exit={{ x: "100%", skewX: -20 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // smooth easeOut
                    />

                    {/* Gold accents - delayed */}
                    <motion.div
                        className="absolute w-[200%] h-[20px] bg-[#C4A484] rotate-[-15deg] top-[40%]"
                        initial={{ x: "-100%" }}
                        animate={{ x: isExiting ? "100%" : "0%" }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute w-[200%] h-[10px] bg-[#C4A484] rotate-[-15deg] top-[60%]"
                        initial={{ x: "-100%" }}
                        animate={{ x: isExiting ? "100%" : "0%" }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
                    />
                </div>
            )}
        </AnimatePresence>
    );
}
