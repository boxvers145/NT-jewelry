"use client";

import { motion } from "framer-motion";
import { GameItem, Rarity, RARITY_TABLE } from "@/features/game-core";
import { cn } from "@/shared/lib/utils";
import { Shield, Zap, Sparkles, Gem as GemIcon } from "lucide-react";

interface ItemCardProps {
    item: GameItem;
    className?: string;
    isNew?: boolean;
}

export function ItemCard({ item, className, isNew }: ItemCardProps) {
    const config = RARITY_TABLE.find((r) => r.rarity === item.rarity) || RARITY_TABLE[0];
    const isUnique = item.rarity === Rarity.Unique;

    return (
        <div className={cn("relative group perspective-1000", className)}>
            <motion.div
                initial={isNew ? { opacity: 0, scale: 0.8, rotateY: 180 } : {}}
                animate={isNew ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={cn(
                    "relative w-72 aspect-[3/4] rounded-xl overflow-hidden border-2 bg-gradient-to-br from-card/90 to-black/90 shadow-2xl backdrop-blur-md transition-transform duration-500 transform-style-3d group-hover:rotate-y-6 group-hover:rotate-x-6"
                )}
                style={{ borderColor: config.color }}
            >
                {/* Holographic Overlay for high rarity */}
                {(item.rarity === Rarity.Legendary || isUnique) && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 animate-pulse z-0 pointer-events-none" />
                )}

                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full p-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span
                                className="text-xs uppercase tracking-wider font-bold"
                                style={{ color: config.color }}
                            >
                                {item.rarity}
                            </span>
                            <h3
                                className={cn(
                                    "font-serif text-lg leading-tight",
                                    isUnique ? "font-bold" : "font-medium"
                                )}
                                style={{ color: isUnique ? "#EF4444" : "white" }}
                            >
                                {item.name}
                            </h3>
                        </div>
                        {isUnique && <Sparkles className="w-5 h-5 text-red-500 animate-spin-slow" />}
                    </div>

                    {/* Image Placeholder */}
                    <div className="flex-1 my-4 relative rounded-lg bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                background: `radial-gradient(circle at center, ${config.color} 0%, transparent 70%)`,
                            }}
                        />
                        <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            {item.base === "Anneau" ? "💍" : item.base === "Pendentif" ? "📿" : "💎"}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground border-b border-white/10 pb-2">
                            <span>Niveau {item.craftedAtLevel}</span>
                            <span>{item.material} / {item.gem}</span>
                        </div>

                        <div className="space-y-1 pt-1">
                            {Object.entries(item.stats).map(([stat, value]) => (
                                <div key={stat} className="flex justify-between items-center text-xs">
                                    <span className="capitalize opacity-80">{stat}</span>
                                    <span className="font-mono font-bold text-primary">+{value}</span>
                                </div>
                            ))}
                            {item.enchantments.length === 0 && (
                                <p className="text-xs text-muted-foreground italic text-center py-2">
                                    Aucun enchantement
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="text-primary font-bold">{item.goldValue.toLocaleString()} Gold</span>
                        <div className="flex gap-1">
                            {Array.from({ length: config.materialMultiplier }).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-current opacity-50" style={{ color: config.color }} />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
