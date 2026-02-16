"use client";

import { motion } from "framer-motion";
import { useGameStore, RARITY_TABLE, NPC_SELL_MULTIPLIER } from "@/features/game-core";
import { Store, Users, Coins, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";

export function MarketView() {
    const { inventory, sellToNPC, gold } = useGameStore();

    const handleSellAll = () => {
        const sellable = inventory.filter((i) => i.rarity === "Poor" || i.rarity === "Common");
        let totalGold = 0;
        for (const item of sellable) {
            totalGold += Math.round(item.goldValue * NPC_SELL_MULTIPLIER);
            sellToNPC(item.id);
        }
        if (totalGold > 0) {
            toast.success(`Vendu ${sellable.length} objets pour ${totalGold} Or !`);
        } else {
            toast("Aucun objet commun à vendre.");
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 p-1">
            <div className="text-center space-y-1">
                <h2 className="font-serif text-2xl text-[#C4A484]">Marché</h2>
                <p className="text-xs text-white/40">Vendez vos créations et trouvez des opportunités</p>
            </div>

            {/* NPC Vendor Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 p-5 rounded-xl bg-black/30 border border-white/10"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#C4A484]/10 border border-[#C4A484]/20 flex items-center justify-center">
                        <Store className="w-6 h-6 text-[#C4A484]" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-white">Marchand PNJ</h3>
                        <p className="text-xs text-white/40">Achète à {Math.round(NPC_SELL_MULTIPLIER * 100)}% de la valeur</p>
                    </div>
                </div>

                <div className="text-center py-2">
                    <p className="text-sm text-white/50">Votre or : <span className="font-bold text-[#F7E7CE]">{gold.toLocaleString()}</span></p>
                    <p className="text-xs text-white/30 mt-1">{inventory.length} objet(s) en inventaire</p>
                </div>

                <div className="space-y-2">
                    <Button onClick={handleSellAll} variant="outline" className="w-full gap-2">
                        <Coins className="w-4 h-4" />
                        Vendre tous les objets communs
                    </Button>

                    <p className="text-[10px] text-center text-white/20">
                        Sélectionnez un objet dans l'inventaire pour le vendre individuellement
                    </p>
                </div>
            </motion.div>

            {/* Player Market (Coming Soon) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4 p-5 rounded-xl bg-black/30 border border-dashed border-white/10 flex-1"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white/20" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-white/30">Marché des Joueurs</h3>
                        <p className="text-xs text-white/20">Bientôt disponible</p>
                    </div>
                </div>

                <div className="text-center py-8 space-y-3">
                    <p className="text-sm text-white/20">Échangez avec d'autres artisans</p>
                    <p className="text-xs text-white/10 max-w-xs mx-auto leading-relaxed">
                        Le marché des joueurs vous permettra de vendre vos créations au prix que vous fixez
                        et d'acheter les pièces des autres artisans.
                    </p>
                </div>
            </motion.div>

            {/* Vitrine (Coming Soon) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-black/20 border border-dashed border-white/5 flex items-center gap-3"
            >
                <span className="text-2xl">🏆</span>
                <div className="flex-1">
                    <h4 className="font-serif text-sm text-white/30">Vitrine & Puissance Mondiale</h4>
                    <p className="text-[10px] text-white/15">Exposez vos pièces et grimpez dans le classement</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/10" />
            </motion.div>
        </div>
    );
}
