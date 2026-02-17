"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameItem, Rarity, RARITY_TABLE } from "@/features/game-core";
import { ItemCard } from "./item-card";
import { Button } from "@/shared/ui/button";
import { PackagePlus, RotateCcw } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useConfetti } from "@/shared/hooks/use-confetti";
import { playSFX, hapticFeedback } from "@/shared/lib/sfx";
import { useTranslations } from "next-intl";

// ─── Types ───────────────────────────────────────────────

interface LootRevealProps {
    item: GameItem;
    onCollect: () => void;
    onForgeAgain: () => void;
}

// ─── Rarity helpers ──────────────────────────────────────

const HIGH_RARITIES = new Set([Rarity.Epic, Rarity.Legendary, Rarity.Unique]);
const LEGENDARY_PLUS = new Set([Rarity.Legendary, Rarity.Unique]);

// ─── Component ───────────────────────────────────────────

export function LootReveal({ item, onCollect, onForgeAgain }: LootRevealProps) {
    const [phase, setPhase] = useState<"mystery" | "revealed">("mystery");
    const { triggerConfetti } = useConfetti();
    const t = useTranslations("lootReveal");
    const isHighRarity = HIGH_RARITIES.has(item.rarity);
    const isLegendary = LEGENDARY_PLUS.has(item.rarity);

    const config =
        RARITY_TABLE.find((r) => r.rarity === item.rarity) || RARITY_TABLE[0];

    const handleReveal = () => {
        if (phase !== "mystery") return;

        setPhase("revealed");

        // SFX
        if (isLegendary) {
            playSFX("legendary_reveal", 0.8);
            hapticFeedback([100, 30, 200]);
        } else {
            playSFX("hit", 0.5);
            hapticFeedback(100);
        }

        // Confetti — gold-themed
        setTimeout(() => {
            triggerConfetti({
                particleCount: isLegendary ? 200 : 80,
                spread: isLegendary ? 120 : 70,
                colors: ["#C4A484", "#F7E7CE", "#A88B6E", "#FFD700"],
                origin: { y: 0.45 },
            });
        }, 150);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center justify-center w-full min-h-[500px]"
        >
            {/* ── God Rays (Epic+ only) ── */}
            <AnimatePresence>
                {phase === "revealed" && isHighRarity && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
                    >
                        <div
                            className="w-[600px] h-[600px] god-ray-spin opacity-20"
                            style={{
                                background: `conic-gradient(from 0deg, transparent 0%, ${config.color}33 10%, transparent 20%, ${config.color}22 30%, transparent 40%, ${config.color}33 50%, transparent 60%, ${config.color}22 70%, transparent 80%, ${config.color}33 90%, transparent 100%)`,
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── White flash ── */}
            <AnimatePresence>
                {phase === "revealed" && (
                    <motion.div
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 bg-white z-50 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* ── Mystery Box ── */}
            <AnimatePresence mode="wait">
                {phase === "mystery" && (
                    <motion.div
                        key="mystery"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center gap-6 cursor-pointer select-none"
                        onClick={handleReveal}
                    >
                        {/* Écrin */}
                        <motion.div
                            whileHover={{
                                x: [-3, 3, -3, 3, -2, 2, 0],
                                transition: { duration: 0.5, repeat: Infinity },
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-36 h-36 rounded-2xl bg-gradient-to-br from-card via-black to-card border-2 border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(196,164,132,0.2)]"
                        >
                            {/* Inner glow */}
                            <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-pulse" />
                            {/* Seam line */}
                            <div className="absolute left-3 right-3 top-1/2 h-px bg-primary/30" />
                            {/* Lock gem */}
                            <div className="relative z-10 w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_15px_rgba(196,164,132,0.3)]">
                                <span className="text-lg">💎</span>
                            </div>
                        </motion.div>

                        {/* CTA */}
                        <motion.p
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-sm text-primary/80 font-medium tracking-wide"
                        >
                            {t("tapToReveal")}
                        </motion.p>
                    </motion.div>
                )}

                {/* ── Revealed Item ── */}
                {phase === "revealed" && (
                    <motion.div
                        key="revealed"
                        className="flex flex-col items-center max-h-[75vh] overflow-y-auto custom-scrollbar px-2"
                    >
                        {/* Item card with dramatic entrance */}
                        <motion.div
                            initial={{ scale: 0.3, opacity: 0, rotateY: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.15,
                            }}
                            className="mb-6"
                        >
                            <div className="relative">
                                {/* Rarity glow behind card */}
                                <div
                                    className="absolute inset-0 blur-[100px] rounded-full opacity-40"
                                    style={{ background: config.color }}
                                />
                                <ItemCard item={item} isNew={true} className="scale-110" />
                            </div>
                        </motion.div>

                        {/* Action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col gap-3 w-full max-w-xs"
                        >
                            <Button
                                onClick={onCollect}
                                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <PackagePlus className="w-4 h-4" />
                                <span className="font-bold">{t("addToInventory")}</span>
                            </Button>
                            <Button
                                onClick={onForgeAgain}
                                variant="outline"
                                className="w-full gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                {t("forgeAgain")}
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
