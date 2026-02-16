"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DEFAULT_RECIPES,
    generateItem,
    GameItem,
    Material,
    Gem,
    ItemBase,
    Recipe
} from "@/features/game-core";
import { ItemCard } from "./item-card";
import { Hammer, Sparkles, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import { useConfetti } from "@/shared/hooks/use-confetti";

export function CraftingInterface() {
    const { triggerConfetti } = useConfetti();
    const [step, setStep] = useState<"select" | "forging" | "reveal">("select");
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(DEFAULT_RECIPES[0]);
    const [lastItem, setLastItem] = useState<GameItem | null>(null);

    // Fake processing delay
    const handleForge = () => {
        setStep("forging");
        setTimeout(() => {
            const item = generateItem(selectedRecipe, 5); // Level 5 for demo
            setLastItem(item);
            setStep("reveal");
            triggerConfetti();
            toast.success("Création réussie !", {
                description: `Vous avez forgé : ${item.name}`,
            });
        }, 2500);
    };

    const reset = () => {
        setStep("select");
        setLastItem(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto min-h-[600px] flex flex-col items-center justify-center p-4">
            <AnimatePresence mode="wait">

                {/* STEP 1: SELECTION */}
                {step === "select" && (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-full space-y-8"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-foreground">L'Atelier de Création</h2>
                            <p className="text-muted-foreground">Sélectionnez une recette pour forger votre destin.</p>
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
                                        <p className="text-sm text-primary font-bold">Coût: {selectedRecipe.baseCost} G</p>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={handleForge}
                                    className="w-full text-lg h-14 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        FORGER L'OBJET
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: FORGING ANIMATION */}
                {step === "forging" && (
                    <motion.div
                        key="forging"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center space-y-8"
                    >
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Hammer className="w-12 h-12 text-primary animate-bounce" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-serif animate-pulse">Fusion des matériaux...</h3>
                    </motion.div>
                )}

                {/* STEP 3: REVEAL */}
                {step === "reveal" && lastItem && (
                    <motion.div
                        key="reveal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="flex flex-col items-center space-y-8"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                                <ItemCard item={lastItem} isNew={true} className="scale-125" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex gap-4"
                        >
                            <Button onClick={reset} variant="outline" className="gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Forger encore
                            </Button>
                            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                <span className="font-bold">Ajouter à l'inventaire</span>
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
