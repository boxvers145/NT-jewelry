"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGameStore,
    useExpedition,
    EXPEDITION_ZONES,
    BASE_PLAYER_STATS,
    type ExpeditionZone,
    type ExpeditionLogEntry,
    type GameItem,
} from "@/features/game-core";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Swords, MapPin, Lock, ChevronRight, ArrowLeft, Trophy } from "lucide-react";
import { toast } from "sonner";

export function ExpeditionView() {
    const { playerLevel, addResources, addXP, addGold, addToInventory } = useGameStore();
    const equippedItems = useGameStore((s) => s.equippedItems);
    const stats = useMemo(() => {
        const s = { ...BASE_PLAYER_STATS };
        for (const item of Object.values(equippedItems) as (GameItem | undefined)[]) {
            if (!item) continue;
            const st = item.stats;
            s.force += (st["puissance"] ?? 0) + (st["endurance"] ?? 0);
            s.precision += (st["agilité"] ?? 0) + (st["perception"] ?? 0);
            s.chance += (st["charisme"] ?? 0) + (st["lumière"] ?? 0) + (st["renaissance"] ?? 0);
        }
        return s;
    }, [equippedItems]);
    const { isRunning, logs, result, runExpedition, reset } = useExpedition();
    const [selectedZone, setSelectedZone] = useState<ExpeditionZone | null>(null);
    const [phase, setPhase] = useState<"select" | "combat" | "results">("select");
    const logEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll log
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // Detect combat end
    useEffect(() => {
        if (result && phase === "combat") {
            setPhase("results");
        }
    }, [result, phase]);

    const handleLaunch = async () => {
        if (!selectedZone) return;
        setPhase("combat");
        const res = await runExpedition(selectedZone, stats, playerLevel);

        // Apply rewards
        if (Object.keys(res.resourcesGained).length > 0) {
            addResources(res.resourcesGained);
        }
        if (res.xpGained > 0) {
            addXP(res.xpGained);
        }
        if (res.goldGained > 0) {
            addGold(res.goldGained);
        }
        for (const item of res.itemsGained) {
            addToInventory(item);
        }

        toast.success(res.success ? "Expédition réussie !" : "Retraite stratégique...", {
            description: `+${res.xpGained} XP, +${res.goldGained} Or`,
        });
    };

    const handleBack = () => {
        reset();
        setSelectedZone(null);
        setPhase("select");
    };

    const getLogColor = (type: ExpeditionLogEntry["type"]): string => {
        switch (type) {
            case "loot": return "text-[#F59E0B]";
            case "danger": return "text-[#EF4444]";
            case "victory": return "text-[#10B981]";
            case "defeat": return "text-[#EF4444]";
            case "damage": return "text-[#3B82F6]";
            default: return "text-white/70";
        }
    };

    return (
        <div className="h-full flex flex-col">
            <AnimatePresence mode="wait">
                {/* ZONE SELECTION */}
                {phase === "select" && (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar p-1"
                    >
                        <div className="text-center space-y-1">
                            <h2 className="font-serif text-2xl text-[#C4A484]">Expéditions</h2>
                            <p className="text-xs text-white/40">Choisissez une zone pour partir en expédition</p>
                        </div>

                        <div className="space-y-3">
                            {EXPEDITION_ZONES.map((zone) => {
                                const locked = playerLevel < zone.minLevel;
                                const isSelected = selectedZone?.id === zone.id;

                                return (
                                    <motion.button
                                        key={zone.id}
                                        whileHover={!locked ? { scale: 1.02 } : {}}
                                        whileTap={!locked ? { scale: 0.98 } : {}}
                                        onClick={() => !locked && setSelectedZone(isSelected ? null : zone)}
                                        disabled={locked}
                                        className={cn(
                                            "w-full text-left p-4 rounded-xl border transition-all",
                                            locked
                                                ? "opacity-40 cursor-not-allowed bg-black/20 border-white/5"
                                                : isSelected
                                                    ? "bg-[#C4A484]/10 border-[#C4A484]/50 shadow-[0_0_20px_rgba(196,164,132,0.15)]"
                                                    : "bg-black/30 border-white/10 hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{zone.emoji}</span>
                                                    <h3 className="font-serif font-bold text-white">{zone.name}</h3>
                                                    {locked && <Lock className="w-3.5 h-3.5 text-white/30" />}
                                                </div>
                                                <p className="text-xs text-white/40 leading-relaxed">{zone.description}</p>
                                                <div className="flex items-center gap-4 text-[10px]">
                                                    <span className="text-white/30">Difficulté:</span>
                                                    <div className="flex gap-0.5">
                                                        {Array.from({ length: 10 }).map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={cn(
                                                                    "w-2 h-2 rounded-sm",
                                                                    i < zone.difficulty ? "bg-[#EF4444]" : "bg-white/10"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    {locked && (
                                                        <span className="text-[#EF4444]">Niv. {zone.minLevel} requis</span>
                                                    )}
                                                </div>
                                            </div>
                                            {isSelected && <ChevronRight className="w-5 h-5 text-[#C4A484] mt-1" />}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Launch Button */}
                        {selectedZone && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="sticky bottom-0 pt-3"
                            >
                                <Button
                                    size="lg"
                                    onClick={handleLaunch}
                                    className="w-full text-lg h-14 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Swords className="w-5 h-5" />
                                        LANCER L'EXPÉDITION
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* COMBAT LOG */}
                {(phase === "combat" || phase === "results") && (
                    <motion.div
                        key="combat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col gap-3 overflow-hidden"
                    >
                        {/* Zone Header */}
                        <div className="flex items-center gap-3 px-1">
                            <button onClick={handleBack} className="text-white/40 hover:text-white/70 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h3 className="font-serif font-bold text-white flex items-center gap-2">
                                    <span>{selectedZone?.emoji}</span>
                                    {selectedZone?.name}
                                </h3>
                                <p className="text-[10px] text-white/30">
                                    {isRunning ? "Combat en cours..." : result?.success ? "Victoire !" : "Terminé"}
                                </p>
                            </div>
                        </div>

                        {/* Combat Log */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/40 rounded-lg border border-white/5 p-3">
                            <div className="combat-log space-y-2">
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={cn("text-sm leading-relaxed", getLogColor(log.type))}
                                    >
                                        <span className="text-white/20 text-xs font-mono mr-2">T{log.turn}</span>
                                        <span className="font-serif italic">{log.message}</span>
                                    </motion.div>
                                ))}
                                {isRunning && (
                                    <motion.div
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-white/30 text-xs"
                                    >
                                        ⏳ En cours...
                                    </motion.div>
                                )}
                                <div ref={logEndRef} />
                            </div>
                        </div>

                        {/* Results Summary */}
                        {phase === "results" && result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2 p-3 rounded-lg bg-black/40 border border-[#C4A484]/20"
                            >
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-[#C4A484]" />
                                    <h4 className="font-serif text-sm text-[#C4A484]">Butin</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-white/50">XP gagné: <span className="text-[#F59E0B] font-bold">+{result.xpGained}</span></div>
                                    <div className="text-white/50">Or gagné: <span className="text-[#F7E7CE] font-bold">+{result.goldGained}</span></div>
                                </div>
                                {Object.keys(result.resourcesGained).length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.entries(result.resourcesGained).map(([mat, qty]) => (
                                            <span key={mat} className="px-2 py-0.5 rounded-full bg-[#C4A484]/10 text-[10px] text-[#C4A484] border border-[#C4A484]/20">
                                                {mat} x{qty}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {result.itemsGained.length > 0 && (
                                    <div className="text-xs text-[#F59E0B]">
                                        🎁 {result.itemsGained.map(i => i.name).join(", ")}
                                    </div>
                                )}
                                <Button onClick={handleBack} variant="outline" size="sm" className="w-full mt-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Retour aux zones
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
