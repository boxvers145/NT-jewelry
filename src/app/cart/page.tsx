"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/shared/lib/page-transition";
import { Button } from "@/shared/ui/button";
import { useCartStore } from "@/features/cart/store";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

    return (
        <PageTransition>
            <div className="min-h-screen container mx-auto px-4 pt-24 md:pt-12 pb-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold">Votre Écrin</h1>
                            <p className="text-muted-foreground text-sm">
                                {items.length} {items.length > 1 ? "pièces sélectionnées" : "pièce sélectionnée"}
                            </p>
                        </div>
                        {items.length > 0 && (
                            <button
                                onClick={() => { clearCart(); toast("Panier vidé"); }}
                                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                            >
                                Tout supprimer
                            </button>
                        )}
                    </div>

                    {/* Items */}
                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-20 space-y-6 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-serif text-foreground">Votre écrin est vide</h2>
                                <p className="text-muted-foreground text-sm max-w-sm">
                                    Explorez nos collections pour trouver la pièce qui vous correspond.
                                </p>
                            </div>
                            <Link href="/catalog">
                                <Button>Découvrir les Collections</Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex gap-4 md:gap-6 p-4 bg-card rounded-lg border border-white/5 hover:border-primary/20 transition-colors"
                                        >
                                            {/* Product Image Placeholder */}
                                            <div className="w-20 h-20 md:w-28 md:h-28 bg-secondary rounded-md flex-shrink-0 flex items-center justify-center border border-white/5">
                                                <span className="text-primary/20 font-serif text-lg">{item.id}</span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <h3 className="font-serif text-base md:text-lg text-foreground truncate">{item.name}</h3>
                                                    <p className="text-primary text-sm font-medium">{item.price}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    {/* Quantity */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                item.quantity > 1
                                                                    ? updateQuantity(item.id, item.quantity - 1)
                                                                    : removeItem(item.id)
                                                            }
                                                            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    {/* Remove */}
                                                    <button
                                                        onClick={() => { removeItem(item.id); toast(`"${item.name}" retiré`); }}
                                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Summary */}
                            <motion.div
                                layout
                                className="p-6 bg-card rounded-lg border border-white/5 space-y-4"
                            >
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Sous-total</span>
                                    <span>{totalPrice().toLocaleString("fr-FR")} €</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Livraison</span>
                                    <span className="text-primary">Offerte</span>
                                </div>
                                <div className="h-px bg-border" />
                                <div className="flex justify-between text-lg font-serif font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{totalPrice().toLocaleString("fr-FR")} €</span>
                                </div>
                                <Button size="lg" className="w-full text-base mt-2">
                                    Procéder au Paiement
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
