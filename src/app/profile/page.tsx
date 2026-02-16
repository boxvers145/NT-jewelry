"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/shared/lib/page-transition";
import { Button } from "@/shared/ui/button";
import {
    User,
    Package,
    Heart,
    Settings,
    LogOut,
    ChevronRight,
    Crown,
} from "lucide-react";
import Link from "next/link";

const MENU_ITEMS = [
    { icon: Package, label: "Mes Commandes", href: "#", badge: "2" },
    { icon: Heart, label: "Ma Liste de Souhaits", href: "#", badge: null },
    { icon: Settings, label: "Paramètres", href: "#", badge: null },
];

const ORDERS = [
    { id: "NT-2025-0042", date: "12 Fév 2025", status: "En cours", item: "Anneau du Néant", price: "890 €" },
    { id: "NT-2025-0038", date: "28 Jan 2025", status: "Livré", item: "Collier Astral", price: "1,450 €" },
];

export default function ProfilePage() {
    return (
        <PageTransition>
            <div className="min-h-screen container mx-auto px-4 pt-24 md:pt-12 pb-12">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-5 p-6 bg-card rounded-xl border border-white/5"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl md:text-2xl font-serif font-bold truncate">Visiteur</h1>
                                <Crown className="w-4 h-4 text-primary flex-shrink-0" />
                            </div>
                            <p className="text-muted-foreground text-sm">Membre depuis Février 2025</p>
                        </div>
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            Éditer
                        </Button>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-3 gap-3"
                    >
                        {[
                            { label: "Commandes", value: "2" },
                            { label: "Favoris", value: "5" },
                            { label: "Points fidélité", value: "340" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-4 bg-card rounded-lg border border-white/5">
                                <p className="text-2xl font-serif font-bold text-primary">{stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-1"
                    >
                        {MENU_ITEMS.map(({ icon: Icon, label, href, badge }, i) => (
                            <Link
                                key={i}
                                href={href}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-card transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <span className="flex-1 text-sm font-medium">{label}</span>
                                {badge && (
                                    <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                                        {badge}
                                    </span>
                                )}
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </Link>
                        ))}
                    </motion.div>

                    {/* Recent Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h2 className="font-serif text-lg font-bold">Commandes récentes</h2>
                        <div className="space-y-3">
                            {ORDERS.map((order, i) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="flex items-center gap-4 p-4 bg-card rounded-lg border border-white/5"
                                >
                                    <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center flex-shrink-0">
                                        <Package className="w-5 h-5 text-primary/40" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{order.item}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {order.id} · {order.date}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm text-primary font-medium">{order.price}</p>
                                        <p className={`text-xs ${order.status === "Livré" ? "text-green-400" : "text-yellow-400"}`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Logout */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <button className="flex items-center gap-3 text-sm text-muted-foreground hover:text-destructive transition-colors p-4 w-full">
                            <LogOut className="w-4 h-4" />
                            Se déconnecter
                        </button>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
