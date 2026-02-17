"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DEFAULT_RECIPES,
    generateItem,
    GameItem,
    Rarity,
    Recipe,
    useGameStore,
} from "@/features/game-core";
import { ForgeMinigame, type ForgeResult } from "./forge-minigame";
import { LootReveal } from "./loot-reveal";
import { Hammer, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { playSFX } from "@/shared/lib/sfx";

export function CraftingInterface() {
    const { addToInventory, addXP, playerLevel } = useGameStore();
    const t = useTranslations("crafting");
    const [step, setStep] = useState<"select" | "qte" | "reveal">("select");
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(DEFAULT_RECIPES[0]);
    const [lastItem, setLastItem] = useState<GameItem | null>(null);

    // ── QTE result handler ──
    const handleQTEResult = (result: ForgeResult) => {
        if (result === "fail") {
            playSFX("fail");
            toast.error(t("forgeFail"), {
                description: t("forgeFailDesc"),
            });
            setStep("select");
            return;
        }

        // Generate item — perfect hit forces Legendary+
        const options =
            result === "perfect" ? { forceMinRarity: Rarity.Legendary } : undefined;
        const item = generateItem(selectedRecipe, playerLevel, options);
        setLastItem(item);
        setStep("reveal");

        if (result === "perfect") {
            toast.success(t("perfectHit"), {
                description: t("perfectHitDesc"),
            });
        }
    };

    const handleCollect = () => {
        if (lastItem) {
            addToInventory(lastItem);
            addXP(15);
            toast.success(t("addedToInventory"));
        }
        reset();
    };

    const reset = () => {
        setStep("select");
        setLastItem(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto min-h-[600px] flex flex-col items-center justify-center p-4">
            <AnimatePresence mode="wait">

                {/* ── STEP 1: RECIPE SELECTION ── */}
                {step === "select" && (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-full space-y-8"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-foreground">{t("title")}</h2>
                            <p className="text-muted-foreground">{t("subtitle")}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Recipe List */}
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {DEFAULT_RECIPES.map((recipe) => (
                                    <button
                                        key={recipe.id}
                                        onClick={() => setSelectedRecipe(recipe)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left group",
                                            selectedRecipe.id === recipe.id
                                                ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(196,164,132,0.2)]"
                                                : "bg-card border-white/5 hover:border-primary/50"
                                        )}
                                    >
                                        <div>
                                            <div className="font-serif font-bold group-hover:text-primary transition-colors">{recipe.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {recipe.requiredMaterial} + {recipe.requiredGem}
                                            </div>
                                        </div>
                                        {selectedRecipe.id === recipe.id && (
                                            <ChevronRight className="w-5 h-5 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Preview & Action */}
                            <div className="flex flex-col justify-center items-center space-y-8 p-8 bg-card/30 rounded-xl border border-white/5">
                                <div className="text-center space-y-4">
                                    <div className="w-24 h-24 rounded-full bg-black/50 border border-primary/20 flex items-center justify-center mx-auto">
                                        <Hammer className="w-10 h-10 text-primary/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-serif text-xl">{selectedRecipe.name}</h3>
                                        <p className="text-sm text-primary font-bold">{t("cost", { cost: selectedRecipe.baseCost })}</p>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={() => setStep("qte")}
                                    className="w-full text-lg h-14 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        {t("forgeBtn")}
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── STEP 2: QTE MINIGAME ── */}
                {step === "qte" && (
                    <motion.div
                        key="qte"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                    >
                        <ForgeMinigame onResult={handleQTEResult} />
                    </motion.div>
                )}

                {/* ── STEP 3: LOOT REVEAL ── */}
                {step === "reveal" && lastItem && (
                    <LootReveal
                        key="reveal"
                        item={lastItem}
                        onCollect={handleCollect}
                        onForgeAgain={reset}
                    />
                )}

            </AnimatePresence>
        </div>
    );
}
