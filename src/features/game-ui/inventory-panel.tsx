"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, RARITY_TABLE, ITEM_BASE_TO_SLOT, NPC_SELL_MULTIPLIER } from "@/features/game-core";
import type { GameItem, EquipSlot } from "@/features/game-core";
import { cn } from "@/shared/lib/utils";
import { Package, Gem, X, Shield, Coins, Backpack } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";

export function InventoryPanel() {
    const { inventory, resources, equipItem, sellToNPC, getCompatibleSlots } = useGameStore();
    const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
    const [activeTab, setActiveTab] = useState<"items" | "resources">("items");

    const handleEquip = (item: GameItem, slot: EquipSlot) => {
        equipItem(item, slot);
        setSelectedItem(null);
        toast.success(`${item.name} équipé !`);
    };

    const handleSell = (item: GameItem) => {
        const price = Math.round(item.goldValue * NPC_SELL_MULTIPLIER);
        sellToNPC(item.id);
        setSelectedItem(null);
        toast.success(`Vendu pour ${price} Or !`);
    };

    return (
        <div className="hud-panel h-full flex flex-col gap-3 p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm text-[#C4A484] uppercase tracking-wider">Inventaire</h3>
                <span className="text-xs text-white/40">{inventory.length} objets</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-black/40 rounded-lg p-1">
                <button
                    onClick={() => setActiveTab("items")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                        activeTab === "items" ? "bg-[#C4A484]/20 text-[#C4A484]" : "text-white/40 hover:text-white/60"
                    )}
                >
                    <Backpack className="w-3.5 h-3.5" />
                    Objets
                </button>
                <button
                    onClick={() => setActiveTab("resources")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                        activeTab === "resources" ? "bg-[#C4A484]/20 text-[#C4A484]" : "text-white/40 hover:text-white/60"
                    )}
                >
                    <Gem className="w-3.5 h-3.5" />
                    Ressources
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === "items" ? (
                        <motion.div
                            key="items"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-4 gap-1.5"
                        >
                            {inventory.map((item) => {
                                const config = RARITY_TABLE.find((r) => r.rarity === item.rarity) || RARITY_TABLE[0];
                                const isSelected = selectedItem?.id === item.id;

                                return (
                                    <motion.button
                                        key={item.id}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.92 }}
                                        onClick={() => setSelectedItem(isSelected ? null : item)}
                                        className={cn(
                                            "relative aspect-square rounded-md border flex items-center justify-center transition-all bg-black/30",
                                            isSelected ? "ring-2 ring-[#C4A484] border-[#C4A484]" : "border-white/10 hover:border-white/20"
                                        )}
                                        style={{
                                            borderColor: !isSelected ? `${config.color}40` : undefined,
                                            boxShadow: `0 0 8px ${config.color}15`,
                                        }}
                                        title={`${item.name} (${item.rarity})\n${item.goldValue} Or`}
                                    >
                                        <span className="text-lg">
                                            {item.base === "Anneau" ? "💍" :
                                                item.base === "Pendentif" ? "📿" :
                                                    item.base === "Bracelet" ? "⛓️" :
                                                        item.base === "Boucle d'Oreille" ? "✨" :
                                                            item.base === "Broche" ? "🔮" :
                                                                item.base === "Diadème" ? "👑" :
                                                                    item.base === "Chaîne" ? "⛓️" : "💎"}
                                        </span>

                                        {/* Rarity dot */}
                                        <div
                                            className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: config.color }}
                                        />

                                        {/* Glow for rare+ */}
                                        {(item.rarity === "Legendary" || item.rarity === "Unique" || item.rarity === "Epic") && (
                                            <div
                                                className="absolute inset-0 rounded-md animate-pulse pointer-events-none opacity-30"
                                                style={{ boxShadow: `inset 0 0 10px ${config.color}` }}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}

                            {/* Empty slots */}
                            {Array.from({ length: Math.max(0, 16 - inventory.length) }).map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="aspect-square rounded-md border border-dashed border-white/5 bg-black/10"
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="resources"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-1.5"
                        >
                            {Object.entries(resources).length === 0 ? (
                                <p className="text-xs text-white/30 text-center py-8">Aucune ressource</p>
                            ) : (
                                Object.entries(resources)
                                    .filter(([, qty]) => qty > 0)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([name, qty]) => (
                                        <div
                                            key={name}
                                            className="flex items-center justify-between px-3 py-2 rounded-md bg-black/30 border border-white/5"
                                        >
                                            <span className="text-xs text-white/70">{name}</span>
                                            <span className="text-xs font-mono font-bold text-[#C4A484]">x{qty}</span>
                                        </div>
                                    ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Item Detail Panel */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="border-t border-white/10 pt-3 space-y-2"
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-0.5 flex-1 min-w-0">
                                <p className="text-xs font-serif font-bold text-white truncate">{selectedItem.name}</p>
                                <p
                                    className="text-[10px] uppercase font-bold tracking-wider"
                                    style={{ color: RARITY_TABLE.find(r => r.rarity === selectedItem.rarity)?.color }}
                                >
                                    {selectedItem.rarity}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="text-white/30 hover:text-white/60 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Stats */}
                        {Object.keys(selectedItem.stats).length > 0 && (
                            <div className="space-y-0.5">
                                {Object.entries(selectedItem.stats).map(([stat, val]) => (
                                    <div key={stat} className="flex justify-between text-[10px]">
                                        <span className="capitalize text-white/50">{stat}</span>
                                        <span className="text-[#C4A484] font-mono font-bold">+{val}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-1.5">
                            {getCompatibleSlots(selectedItem).map((slot) => (
                                <Button
                                    key={slot}
                                    size="xs"
                                    onClick={() => handleEquip(selectedItem, slot)}
                                    className="w-full text-xs"
                                >
                                    <Shield className="w-3 h-3" />
                                    Équiper ({ITEM_BASE_TO_SLOT[selectedItem.base].length > 1 ?
                                        (slot === "ring_left" ? "Anneau G" : slot === "ring_right" ? "Anneau D" : slot === "head" ? "Tête" : "Collier")
                                        : "Équiper"})
                                </Button>
                            ))}
                            <Button
                                size="xs"
                                variant="outline"
                                onClick={() => handleSell(selectedItem)}
                                className="w-full text-xs"
                            >
                                <Coins className="w-3 h-3" />
                                Vendre PNJ ({Math.round(selectedItem.goldValue * NPC_SELL_MULTIPLIER)} Or)
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
