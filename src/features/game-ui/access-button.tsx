"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface AccessButtonProps {
    className?: string;
}

export function AccessButton({ className }: AccessButtonProps) {
    return (
        <Link href="/game">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative group flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-primary/30 hover:border-primary transition-colors overflow-hidden",
                    className
                )}
            >
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />

                {/* Pulsing Gem Core */}
                <div className="relative">
                    <Sparkles className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    <span className="absolute inset-0 animate-ping opacity-75 rounded-full bg-primary h-full w-full -z-10 group-hover:opacity-100" />
                </div>
            </motion.button>
        </Link>
    );
}
