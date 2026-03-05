"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { useGameStore } from "@/features/game-core/game-store";
import { UserInventoryItem } from "@/features/digital-twin/types";
import { JewelryViewer3D } from "@/features/digital-twin/ui/jewelry-viewer-3d";
import { Button } from "@/shared/ui/button";
import { GameItem } from "@/features/game-core/types";

// Helper to group identical items into stacks
function getInventoryStacks(inventory: GameItem[]): UserInventoryItem[] {
    const stacks = new Map<string, UserInventoryItem>();

    inventory.forEach((item) => {
        // We group by visualId. If an item doesn't have it, we fallback to id or a combination
        const stackKey = item.visualId || `${item.base}-${item.material}-${item.gem}`;

        if (stacks.has(stackKey)) {
            const existing = stacks.get(stackKey)!;
            existing.quantity += 1;
        } else {
            stacks.set(stackKey, {
                id: stackKey,
                item,
                quantity: 1,
                acquiredAt: item.craftedAt || new Date().toISOString(),
            });
        }
    });

    return Array.from(stacks.values());
}

export default function CollectionPage() {
    const t = useTranslations("collection");
    const { inventory } = useGameStore();
    const [selectedStack, setSelectedStack] = useState<UserInventoryItem | null>(null);

    // Real inventory merged with fake data if empty (for demo purpose if user has nothing)
    const displayInventory = inventory.length > 0 ? inventory : getDemoInventory();
    const stackedInventory = getInventoryStacks(displayInventory);

    return (
        <div className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full mt-10">
            <div className="mb-10 text-center">
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t("subtitle")}
                </p>
            </div>

            {stackedInventory.length === 0 ? (
                <div className="flex-1 flex items-center justify-center min-h-[40vh]">
                    <div className="text-center p-8 rounded-2xl bg-muted/20 border border-border/50 backdrop-blur-sm">
                        <p className="text-xl font-medium mb-2">{t("emptyTitle")}</p>
                        <p className="text-muted-foreground">{t("emptySubtitle")}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {stackedInventory.map((stack) => (
                        <motion.div
                            key={stack.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedStack(stack)}
                            className="group cursor-pointer aspect-square relative rounded-xl bg-[#121212] border border-border/40 overflow-hidden shadow-lg hover:shadow-primary/20 hover:border-primary/40 transition-all flex flex-col"
                        >
                            {/* Stack Badge */}
                            {stack.quantity > 1 && (
                                <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                    x{stack.quantity}
                                </div>
                            )}

                            <div className="flex-1 flex items-center justify-center p-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {/* Decorative placeholder for miniature. In real app, we might use a small WebGL canvas or an image render */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center blur-[1px] group-hover:blur-none transition-all duration-500 group-hover:scale-110">
                                    <span className="text-3xl">✦</span>
                                </div>
                            </div>

                            <div className="p-4 bg-black/40 backdrop-blur-md border-t border-border/20 z-10">
                                <p className="font-serif font-semibold text-sm truncate">{stack.item.name || stack.item.base}</p>
                                <p className="text-xs text-primary/80 capitalize truncate">{stack.item.material}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* 3D Viewer Modal */}
            <AnimatePresence>
                {selectedStack && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
                    >
                        <div className="relative w-full max-w-5xl h-full max-h-[800px] flex flex-col md:flex-row bg-[#0A0A0A] border border-border/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedStack(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* 3D Viewer Area (Left/Top) */}
                            <div className="flex-1 min-h-[400px] md:min-h-0 relative">
                                <JewelryViewer3D background="radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%)" />
                            </div>

                            {/* Info Panel (Right/Bottom) */}
                            <div className="w-full md:w-80 bg-[#121212] border-t md:border-t-0 md:border-l border-border/20 p-8 flex flex-col items-center justify-center text-center">
                                <h2 className="font-serif text-3xl font-bold mb-2">{selectedStack.item.name || selectedStack.item.base}</h2>

                                <div className="w-12 h-px bg-primary/50 my-6" />

                                <div className="space-y-4 w-full text-left">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{t("material")}</p>
                                        <p className="text-lg font-medium">{selectedStack.item.material}</p>
                                    </div>

                                    {selectedStack.item.gem && selectedStack.item.gem !== "Aucune" && (
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{t("gem")}</p>
                                            <p className="text-lg font-medium">{selectedStack.item.gem}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{t("rarity")}</p>
                                        <p className="text-lg font-medium capitalize text-primary">{selectedStack.item.rarity || "Legendary"}</p>
                                    </div>

                                    {selectedStack.quantity > 1 && (
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{t("owned")}</p>
                                            <p className="text-lg font-medium">{selectedStack.quantity} {t("copies")}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-8 w-full">
                                    <Button variant="outline" className="w-full rounded-full" onClick={() => setSelectedStack(null)}>
                                        {t("close")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Temporary fake data if user has empty inventory, just so they can see the viewer
function getDemoInventory(): any[] {
    return [
        {
            id: "demo-1",
            name: "Bague de l'Aube",
            base: "Anneau",
            material: "Or",
            gem: "Diamant",
            rarity: "Legendary",
            visualId: "ring_gold_diamond",
        },
        {
            id: "demo-2",
            name: "Pendentif Stellaire",
            base: "Pendentif",
            material: "Argent",
            gem: "Saphir",
            rarity: "Epic",
            visualId: "pendant_silver_sapphire",
        },
        {
            id: "demo-3", // Duplicate to show stacking
            name: "Pendentif Stellaire",
            base: "Pendentif",
            material: "Argent",
            gem: "Saphir",
            rarity: "Epic",
            visualId: "pendant_silver_sapphire",
        }
    ];
}
