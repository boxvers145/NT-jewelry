"use client";

import { motion } from "framer-motion";
import { PageTransition, StaggerItem } from "@/shared/lib/page-transition";

const VALUES = [
    { title: "L'Artisanat d'Exception", desc: "Chaque pièce est façonnée à la main par nos maîtres artisans, héritiers d'un savoir-faire séculaire réinventé pour une nouvelle génération." },
    { title: "L'Inspiration Imaginaire", desc: "Nos collections puisent dans les mythologies du jeu vidéo, du cinéma et de l'anime — transformées en objets d'art tangibles et précieux." },
    { title: "La Rareté Programmée", desc: "Nos éditions limitées sont numérotées et certifiées. Posséder une pièce NT, c'est détenir un fragment d'un univers exclusif." },
];

const TIMELINE = [
    { year: "2024", event: "Naissance de la vision NT Jewelry" },
    { year: "2024", event: "Première collection 'Genesis' — 12 pièces uniques" },
    { year: "2025", event: "Ouverture de l'atelier parisien" },
    { year: "2025", event: "Lancement de l'Écrin Digital" },
];

export default function MaisonPage() {
    return (
        <PageTransition>
            <div className="min-h-screen">
                {/* Full-screen Hero */}
                <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(196,164,132,0.08)_0%,_transparent_70%)]" />
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="container mx-auto px-4 text-center space-y-6 relative z-10"
                    >
                        <span className="text-primary tracking-[0.3em] text-xs uppercase">La Maison</span>
                        <h1 className="text-4xl md:text-7xl font-serif font-bold leading-tight">
                            Là où le luxe<br />
                            <span className="text-primary">rencontre l'imaginaire</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
                            NT Jewelry est née de la conviction que la haute joaillerie peut raconter
                            les histoires de notre époque — celles des mondes virtuels devenus légendaires.
                        </p>
                    </motion.div>
                </section>

                {/* Values */}
                <section className="container mx-auto px-4 py-20 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {VALUES.map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                className="space-y-4 p-6 md:p-8 rounded-lg bg-card/50 border border-white/5 hover:border-primary/20 transition-colors duration-500"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-serif text-lg font-bold">{i + 1}</span>
                                </div>
                                <h3 className="font-serif text-xl font-bold">{val.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Manifesto Quote */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-card/30" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px]" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="container mx-auto px-4 text-center relative z-10 max-w-3xl space-y-4"
                    >
                        <div className="text-6xl text-primary/30 font-serif">&ldquo;</div>
                        <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed text-foreground/90">
                            Un bijou ne devrait pas seulement orner. Il devrait raconter qui vous êtes,
                            les mondes que vous avez traversés, les batailles que vous avez menées.
                        </blockquote>
                        <p className="text-primary tracking-widest text-sm uppercase pt-4">— Fondateur, NT Jewelry</p>
                    </motion.div>
                </section>

                {/* Timeline */}
                <section className="container mx-auto px-4 py-20 md:py-32">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-serif font-bold text-center mb-16"
                    >
                        Notre Histoire
                    </motion.h2>

                    <div className="max-w-lg mx-auto relative">
                        {/* Vertical line */}
                        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-border" />

                        <div className="space-y-10">
                            {TIMELINE.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    className="flex gap-6 items-start"
                                >
                                    <div className="relative z-10 flex-shrink-0 w-8 md:w-12 h-8 md:h-12 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>
                                    <div className="pt-1 md:pt-2 space-y-1">
                                        <span className="text-xs text-primary font-medium">{item.year}</span>
                                        <p className="text-foreground text-sm md:text-base">{item.event}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
}
