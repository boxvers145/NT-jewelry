"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Gem } from "lucide-react";
import { CharacterPanel } from "@/features/game-ui/character-panel";
import { MainView } from "@/features/game-ui/main-view";
import { InventoryPanel } from "@/features/game-ui/inventory-panel";
import { useTranslations } from "next-intl";

export default function GamePage() {
    const t = useTranslations("nav");
    const tg = useTranslations("game");
    return (
        <div className="relative z-10 h-full flex flex-col">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-4 py-2 border-b border-[#C4A484]/10 bg-black/30 backdrop-blur-sm">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-white/40 hover:text-[#C4A484] transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("backToSite")}</span>
                </Link>

                <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-[#C4A484]" />
                    <h1 className="font-serif text-lg text-[#C4A484] tracking-wide">
                        NT <span className="text-white/80">Jewelry</span> — {tg("adventure")}
                    </h1>
                </div>

                <div className="w-24" /> {/* Spacer for centering */}
            </header>

            {/* 3-Column HUD Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-2 p-2 overflow-hidden">
                {/* Left: Character Panel (hidden on mobile) */}
                <div className="hidden lg:block overflow-hidden">
                    <CharacterPanel />
                </div>

                {/* Center: Main View */}
                <div className="overflow-hidden min-h-0">
                    <MainView />
                </div>

                {/* Right: Inventory (hidden on mobile) */}
                <div className="hidden lg:block overflow-hidden">
                    <InventoryPanel />
                </div>
            </div>

            {/* Mobile: Bottom Panels Toggle */}
            <MobileDrawers />
        </div>
    );
}

// Mobile toggle for Character/Inventory panels
function MobileDrawers() {
    const tg = useTranslations("game");
    return (
        <div className="lg:hidden flex border-t border-[#C4A484]/10 bg-black/30 backdrop-blur-sm">
            <MobileTab label={tg("character")} panel="character" />
            <MobileTab label={tg("inventory")} panel="inventory" />
        </div>
    );
}

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

function MobileTab({ label, panel }: { label: string; panel: "character" | "inventory" }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="flex-1 py-3 text-xs font-medium text-white/40 hover:text-[#C4A484] transition-colors text-center"
            >
                {label}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed bottom-12 left-0 right-0 h-[60vh] z-50 bg-[#0A0A0A] border-t border-[#C4A484]/20 overflow-y-auto"
                    >
                        <div className="p-2 h-full">
                            {panel === "character" ? <CharacterPanel /> : <InventoryPanel />}
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-2 right-3 text-white/30 hover:text-white/60 text-sm"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
