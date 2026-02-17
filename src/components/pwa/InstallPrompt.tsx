"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share, Plus, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/shared/ui/drawer";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIOSDrawer, setShowIOSDrawer] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if already running as standalone (installed)
        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (navigator as any).standalone === true;
        setIsStandalone(standalone);

        // Check if dismissed previously this session
        if (sessionStorage.getItem("pwa-install-dismissed") === "true") {
            setDismissed(true);
        }

        // Detect iOS
        const ua = navigator.userAgent;
        const isiOS =
            /iPad|iPhone|iPod/.test(ua) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
        setIsIOS(isiOS);

        // Listen for beforeinstallprompt (Android / Desktop Chrome)
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSDrawer(true);
            return;
        }

        if (deferredPrompt) {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setDeferredPrompt(null);
                setIsStandalone(true);
            }
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem("pwa-install-dismissed", "true");
    };

    // Don't show if already installed, dismissed, or no prompt available (except iOS)
    const shouldShow = !isStandalone && !dismissed && (isIOS || deferredPrompt);

    return (
        <>
            <AnimatePresence>
                {shouldShow && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 2 }}
                        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm"
                    >
                        <div className="relative flex items-center gap-3 p-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-primary/20 shadow-[0_0_30px_rgba(196,164,132,0.15)]">
                            {/* Dismiss button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Fermer"
                            >
                                <X className="w-3 h-3" />
                            </button>

                            {/* Icon */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Download className="w-5 h-5 text-primary" />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                    NT Jewelry
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Installer l&apos;app pour une meilleure expérience
                                </p>
                            </div>

                            {/* CTA Button */}
                            <Button
                                onClick={handleInstallClick}
                                size="sm"
                                className="flex-shrink-0 text-xs font-semibold tracking-wide"
                            >
                                Installer
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* iOS Instruction Drawer */}
            <Drawer open={showIOSDrawer} onOpenChange={setShowIOSDrawer}>
                <DrawerContent className="bg-card border-primary/10">
                    <DrawerHeader className="text-center pb-2">
                        <DrawerTitle className="text-lg font-semibold text-foreground">
                            Installer NT Jewelry
                        </DrawerTitle>
                        <DrawerDescription className="text-muted-foreground text-sm">
                            Ajoutez l&apos;app sur votre écran d&apos;accueil en 2 étapes
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="px-6 pb-4 space-y-5">
                        {/* Step 1 */}
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                1
                            </div>
                            <div className="flex-1 pt-1">
                                <p className="text-sm font-medium text-foreground">
                                    Appuyez sur{" "}
                                    <span className="inline-flex items-center gap-1 text-primary font-semibold">
                                        Partager
                                        <Share className="w-4 h-4" />
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Icône en bas de l&apos;écran dans Safari
                                </p>
                            </div>
                        </div>

                        {/* Connector */}
                        <div className="ml-5 h-4 border-l border-dashed border-primary/30" />

                        {/* Step 2 */}
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                2
                            </div>
                            <div className="flex-1 pt-1">
                                <p className="text-sm font-medium text-foreground">
                                    Appuyez sur{" "}
                                    <span className="inline-flex items-center gap-1 text-primary font-semibold">
                                        Sur l&apos;écran d&apos;accueil
                                        <Plus className="w-4 h-4" />
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    L&apos;app s&apos;ajoutera comme une application native
                                </p>
                            </div>
                        </div>
                    </div>

                    <DrawerFooter className="pt-0">
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full">
                                J&apos;ai compris
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
