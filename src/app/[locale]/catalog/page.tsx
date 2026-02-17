"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/shared/lib/page-transition";
import { Button } from "@/shared/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const CATEGORY_KEYS = ["all", "rings", "necklaces", "bracelets", "earrings", "limited"] as const;

const PRODUCTS = [
    { id: 1, name: "Anneau du Néant", price: "890 €", categoryKey: "rings", tagKey: "new" },
    { id: 2, name: "Collier Astral", price: "1,450 €", categoryKey: "necklaces", tagKey: null },
    { id: 3, name: "Bracelet Voidwalker", price: "720 €", categoryKey: "bracelets", tagKey: "limited" },
    { id: 4, name: "Pendentif Éclipse", price: "1,180 €", categoryKey: "necklaces", tagKey: null },
    { id: 5, name: "Chevalière du Boss Final", price: "2,100 €", categoryKey: "rings", tagKey: "bestseller" },
    { id: 6, name: "Créoles Pixel", price: "560 €", categoryKey: "earrings", tagKey: "new" },
    { id: 7, name: "Bracelet Chain-Link 8-bit", price: "680 €", categoryKey: "bracelets", tagKey: null },
    { id: 8, name: "Bague Triforce", price: "1,650 €", categoryKey: "rings", tagKey: "limited" },
    { id: 9, name: "Collier Materia", price: "2,300 €", categoryKey: "necklaces", tagKey: "bestseller" },
];

export default function CatalogPage() {
    const t = useTranslations("catalog");
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = PRODUCTS.filter((p) => {
        const matchesCategory = activeCategory === "all" || p.categoryKey === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <PageTransition>
            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <section className="container mx-auto px-4 pt-24 md:pt-12 pb-8 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl font-serif font-bold">{t("title")}</h1>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={t("search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORY_KEYS.map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory === key
                                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(196,164,132,0.3)]"
                                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                                    }`}
                            >
                                {t(`categories.${key}`)}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Product Grid */}
                <section className="container mx-auto px-4 pb-12 flex-1">
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                            >
                                <Link href={`/catalog/${product.id}`} className="group block">
                                    <motion.div
                                        layoutId={`product-image-${product.id}`}
                                        className="relative aspect-[3/4] bg-card rounded-lg overflow-hidden border border-white/5 group-hover:border-primary/30 transition-all duration-500"
                                    >
                                        {/* Glow on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Tag */}
                                        {product.tagKey && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-primary/90 text-primary-foreground rounded-sm font-medium">
                                                    {t(`tags.${product.tagKey}`)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Placeholder */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                                                <span className="text-white/10 text-2xl font-serif">{product.id}</span>
                                            </div>
                                        </div>

                                        {/* Scale effect */}
                                        <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out" />
                                    </motion.div>

                                    {/* Info */}
                                    <div className="mt-3 space-y-1">
                                        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-primary/80 font-medium">{product.price}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <p className="text-muted-foreground text-lg">{t("noResults")}</p>
                            <Button variant="outline" onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}>
                                {t("resetFilters")}
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </PageTransition>
    );
}
