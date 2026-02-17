"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/shared/lib/page-transition";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, Heart, ShoppingBag, Shield, Truck, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { use } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const PRODUCTS: Record<string, { name: string; price: string; description: string; details: string[]; category: string }> = {
    "1": { name: "Anneau du Néant", price: "890 €", category: "Bagues", description: "Forgé dans l'obscurité entre les mondes, cet anneau capture l'essence du vide primordial. Son design organique évoque les fractales cosmiques aperçues aux confins de l'univers.", details: ["Or 18 carats noirci", "Diamant noir 0.5ct", "Taille ajustable", "Certificat d'authenticité"] },
    "2": { name: "Collier Astral", price: "1,450 €", category: "Colliers", description: "Une constellation personnelle portée autour du cou. Chaque étoile est un diamant serti à la main, cartographiant un ciel qui n'existe que dans les rêves.", details: ["Or blanc 18 carats", "7 diamants VS1", "Chaîne 45cm ajustable", "Écrin luxe inclus"] },
    "3": { name: "Bracelet Voidwalker", price: "720 €", category: "Bracelets", description: "Pour ceux qui marchent entre les dimensions. Ce bracelet articulé épouse le poignet comme une seconde peau, ses maillons évoquant les portails dimensionnels.", details: ["Argent 925 rhodié", "Fermoir magnétique", "Gravure personnalisable", "Édition limitée à 99 pièces"] },
    "4": { name: "Pendentif Éclipse", price: "1,180 €", category: "Colliers", description: "Quand la lune dévore le soleil, la beauté de l'ombre se révèle. Ce pendentif capture cet instant fugace dans un disque d'or et d'onyx.", details: ["Or jaune 18 carats", "Onyx naturel", "Chaîne 50cm", "Pièce unique"] },
    "5": { name: "Chevalière du Boss Final", price: "2,100 €", category: "Bagues", description: "Réservée aux plus vaillants. Cette chevalière massive porte les armoiries d'un royaume digital, gravées au laser avec une précision chirurgicale.", details: ["Or 18 carats massif", "Rubis cabochon central", "Gravure laser HD", "Taille sur mesure"] },
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const product = PRODUCTS[id] || PRODUCTS["1"];
    const t = useTranslations("product");

    return (
        <PageTransition>
            <div className="min-h-screen">
                {/* Back navigation */}
                <div className="container mx-auto px-4 pt-24 md:pt-8">
                    <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        {t("backToCollections")}
                    </Link>
                </div>

                <div className="container mx-auto px-4 py-8 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        {/* Product Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            layoutId={`product-image-${id}`}
                        >
                            <div className="relative aspect-square bg-card rounded-lg overflow-hidden border border-white/5">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(196,164,132,0.15)_0%,_transparent_60%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(247,231,206,0.08)_0%,_transparent_50%)]" />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center">
                                        <span className="text-primary/30 text-sm font-serif italic">{t("photoSoon")}</span>
                                    </div>
                                </div>

                                <button className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-sm rounded-full hover:bg-primary/20 transition-colors group">
                                    <Heart className="w-5 h-5 text-white/50 group-hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col justify-center space-y-6"
                        >
                            <div className="space-y-2">
                                <span className="text-xs uppercase tracking-[0.2em] text-primary">{product.category}</span>
                                <h1 className="text-3xl md:text-5xl font-serif font-bold">{product.name}</h1>
                                <p className="text-2xl text-primary font-medium">{product.price}</p>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                            {/* Details */}
                            <div className="space-y-3 py-4 border-t border-border">
                                {product.details.map((detail, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="flex items-center gap-3 text-sm"
                                    >
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        <span className="text-foreground/80">{detail}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    size="lg"
                                    className="flex-1 text-base"
                                    onClick={() => toast.success(`"${product.name}" ajouté au panier`)}
                                >
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    {t("addToCart")}
                                </Button>
                                <Button variant="outline" size="lg">
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                                {[
                                    { icon: Shield, label: t("badges.authentic") },
                                    { icon: Truck, label: t("badges.freeShipping") },
                                    { icon: RotateCcw, label: t("badges.return30") },
                                ].map(({ icon: Icon, label }, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 text-center">
                                        <Icon className="w-5 h-5 text-primary/60" />
                                        <span className="text-[11px] text-muted-foreground">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
