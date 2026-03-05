"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, QrCode, Lock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/shared/ui/input";
import { MagneticButton } from "@/shared/ui/magnetic-button";

export default function RedeemPage() {
    const t = useTranslations("redeem");
    const [code, setCode] = useState("");
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSimulateScan = () => {
        toast.info(t("simulateScanStart"));
        setCode("NT-JWLX-2025-ABCD");
    };

    const handleRedeem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsRedeeming(true);

        // Simulate network delay
        setTimeout(() => {
            setIsRedeeming(false);
            setSuccess(true);
            toast.success(t("successToast"));

            // Keep success state for a bit, then reset (or we could redirect)
            setTimeout(() => {
                setSuccess(false);
                setCode("");
            }, 3000);
        }, 1500);
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            {/* Vault Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-border/50  shadow-2xl shadow-black/50 p-8 md:p-12">

                    {/* Subtle glowing accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    <div className="text-center mb-10 space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Lock className="w-8 h-8 text-primary" strokeWidth={1.5} />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">
                            {t("title")}
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

                    <form onSubmit={handleRedeem} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Input
                                    type="text"
                                    placeholder={t("inputPlaceholder")}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    disabled={isRedeeming || success}
                                    className="w-full bg-[#0A0A0A] border-border/50 text-center text-xl tracking-[0.2em] font-mono h-16 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground/50 transition-all"
                                />

                                {/* QR Scan Simulation Button */}
                                <button
                                    type="button"
                                    onClick={handleSimulateScan}
                                    disabled={isRedeeming || success}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                                    aria-label={t("scanButton")}
                                    title={t("scanButton")}
                                >
                                    <QrCode className="w-5 h-5" />
                                </button>
                            </div>

                            <MagneticButton
                                type="submit"
                                disabled={!code.trim() || isRedeeming || success}
                                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium tracking-wide transition-all data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed"
                            >
                                <AnimatePresence mode="wait">
                                    {isRedeeming ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                                            {t("authenticating")}
                                        </motion.div>
                                    ) : success ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            {t("unlocked")}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="idle"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {t("unlockAction")}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </MagneticButton>
                        </div>

                        <p className="text-xs text-center text-muted-foreground/60">
                            {t("helpText")}
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
