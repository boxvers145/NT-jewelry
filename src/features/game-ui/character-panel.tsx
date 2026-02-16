"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGameStore, getXPProgress, RARITY_TABLE, BASE_PLAYER_STATS } from "@/features/game-core";
import { EquipSlot, EQUIP_SLOT_LABELS, EQUIP_SLOT_ICONS, type GameItem } from "@/features/game-core";
import { cn } from "@/shared/lib/utils";
import { Swords, Target, Sparkles, Star } from "lucide-react";

export function CharacterPanel() {
    const equippedItems = useGameStore((s) => s.equippedItems);
    const playerLevel = useGameStore((s) => s.playerLevel);
    const playerXP = useGameStore((s) => s.playerXP);
    const gold = useGameStore((s) => s.gold);
    const unequipItem = useGameStore((s) => s.unequipItem);

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

    const xpProgress = getXPProgress(playerLevel, playerXP);

    const statBars = [
        { label: "Force", value: stats.force, icon: Swords, color: "#EF4444", max: 100 },
        { label: "Précision", value: stats.precision, icon: Target, color: "#3B82F6", max: 100 },
        { label: "Chance", value: stats.chance, icon: Sparkles, color: "#F59E0B", max: 100 },
    ];

    return (
        <div className="hud-panel h-full flex flex-col gap-4 p-4 overflow-y-auto custom-scrollbar">
            {/* Player Level */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-[#C4A484]" />
                    <h2 className="font-serif text-xl text-[#C4A484]">Niveau {playerLevel}</h2>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 border border-white/10 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#C4A484] to-[#F7E7CE]"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress.percentage}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-xs text-white/50">{xpProgress.current} / {xpProgress.required} XP</p>
                <p className="text-sm font-bold text-[#F7E7CE]">💰 {gold.toLocaleString()} Or</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#C4A484]/30 to-transparent" />

            {/* Stats */}
            <div className="space-y-3">
                <h3 className="font-serif text-sm text-[#C4A484] uppercase tracking-wider">Statistiques</h3>
                {statBars.map((s) => (
                    <div key={s.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-white/70">
                                <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                                {s.label}
                            </span>
                            <span className="font-mono font-bold" style={{ color: s.color }}>{s.value}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black/60 border border-white/5 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: s.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((s.value / s.max) * 100, 100)}%` }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#C4A484]/30 to-transparent" />

            {/* Equipment (Paper Doll) */}
            <div className="space-y-3">
                <h3 className="font-serif text-sm text-[#C4A484] uppercase tracking-wider">Équipement</h3>
                <div className="grid grid-cols-2 gap-2">
                    {Object.values(EquipSlot).map((slot) => {
                        const item = equippedItems[slot];
                        const rarityConfig = item
                            ? RARITY_TABLE.find((r) => r.rarity === item.rarity) || RARITY_TABLE[0]
                            : null;

                        return (
                            <motion.button
                                key={slot}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => item && unequipItem(slot)}
                                className={cn(
                                    "relative aspect-square rounded-lg border flex flex-col items-center justify-center gap-1 transition-all",
                                    item
                                        ? "bg-black/40 backdrop-blur-sm cursor-pointer hover:bg-black/60"
                                        : "bg-black/20 border-dashed border-white/10 cursor-default"
                                )}
                                style={{
                                    borderColor: item ? rarityConfig?.color ?? "#27272A" : undefined,
                                    boxShadow: item ? `0 0 12px ${rarityConfig?.color}30` : undefined,
                                }}
                                title={item ? `${item.name} — Cliquer pour déséquiper` : EQUIP_SLOT_LABELS[slot]}
                            >
                                {item ? (
                                    <>
                                        <span className="text-xl">{EQUIP_SLOT_ICONS[slot]}</span>
                                        <span className="text-[10px] text-center leading-tight px-1 line-clamp-2" style={{ color: rarityConfig?.color }}>
                                            {item.name}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl opacity-30">{EQUIP_SLOT_ICONS[slot]}</span>
                                        <span className="text-[10px] text-white/30">{EQUIP_SLOT_LABELS[slot]}</span>
                                    </>
                                )}

                                {/* Rarity glow for high-tier items */}
                                {item && (item.rarity === "Legendary" || item.rarity === "Unique") && (
                                    <div
                                        className="absolute inset-0 rounded-lg animate-pulse pointer-events-none"
                                        style={{ boxShadow: `inset 0 0 15px ${rarityConfig?.color}20` }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
