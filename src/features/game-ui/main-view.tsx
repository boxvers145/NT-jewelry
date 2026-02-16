"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { CraftingInterface } from "./crafting-interface";
import { ExpeditionView } from "./expedition-view";
import { MarketView } from "./market-view";
import { Hammer, Swords, Store } from "lucide-react";

type TabId = "atelier" | "expedition" | "market";

const TABS: { id: TabId; label: string; icon: typeof Hammer }[] = [
    { id: "atelier", label: "Atelier", icon: Hammer },
    { id: "expedition", label: "Expédition", icon: Swords },
    { id: "market", label: "Marché", icon: Store },
];

export function MainView() {
    const [activeTab, setActiveTab] = useState<TabId>("atelier");

    return (
        <div className="hud-panel h-full flex flex-col overflow-hidden">
            {/* Tab Bar */}
            <div className="flex border-b border-white/10 bg-black/20">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all",
                                isActive
                                    ? "text-[#C4A484]"
                                    : "text-white/40 hover:text-white/60"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4A484]"
                                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <AnimatePresence mode="wait">
                    {activeTab === "atelier" && (
                        <motion.div
                            key="atelier"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full"
                        >
                            <CraftingInterface />
                        </motion.div>
                    )}
                    {activeTab === "expedition" && (
                        <motion.div
                            key="expedition"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full"
                        >
                            <ExpeditionView />
                        </motion.div>
                    )}
                    {activeTab === "market" && (
                        <motion.div
                            key="market"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full"
                        >
                            <MarketView />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
