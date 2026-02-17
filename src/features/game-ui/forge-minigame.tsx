"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { playSFX, hapticFeedback } from "@/shared/lib/sfx";
import { useTranslations } from "next-intl";

// ─── Types ───────────────────────────────────────────────

export type ForgeResult = "perfect" | "success" | "fail";

interface ForgeMinigameProps {
    onResult: (result: ForgeResult) => void;
}

// ─── Constants ───────────────────────────────────────────

const BAR_TRAVEL_SPEED = 1.4; // full bar traversals per second
const PERFECT_RADIUS = 0.04; // ±4% of bar = 8% wide
const SUCCESS_RADIUS = 0.12; // ±12% of bar = 24% wide

// ─── Component ───────────────────────────────────────────

export function ForgeMinigame({ onResult }: ForgeMinigameProps) {
    const t = useTranslations("forge");
    const [phase, setPhase] = useState<"ready" | "running" | "stopped">("ready");
    const [cursorPos, setCursorPos] = useState(0);
    const [result, setResult] = useState<ForgeResult | null>(null);

    // Stable random target (generated once on mount)
    const targetCenter = useRef(Math.random() * 0.6 + 0.2);
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef(0);
    const stoppedPosRef = useRef(0);

    // ── Animation loop ──
    const animate = useCallback((timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = (timestamp - startTimeRef.current) / 1000;

        // Ping-pong: cursor oscillates 0→1→0→1…
        const raw = (elapsed * BAR_TRAVEL_SPEED) % 2;
        const pos = raw <= 1 ? raw : 2 - raw;
        setCursorPos(pos);

        rafRef.current = requestAnimationFrame(animate);
    }, []);

    // ── Start the game ──
    const startGame = useCallback(() => {
        setPhase("running");
        startTimeRef.current = 0;
        rafRef.current = requestAnimationFrame(animate);
    }, [animate]);

    // ── Stop & evaluate ──
    const stopCursor = useCallback(() => {
        if (phase !== "running") return;
        cancelAnimationFrame(rafRef.current);
        setPhase("stopped");

        // Snapshot the current position
        const pos = cursorPos;
        stoppedPosRef.current = pos;

        const distance = Math.abs(pos - targetCenter.current);

        let r: ForgeResult;
        if (distance <= PERFECT_RADIUS) {
            r = "perfect";
            playSFX("hit", 0.8);
            hapticFeedback([100, 30, 200]);
        } else if (distance <= SUCCESS_RADIUS) {
            r = "success";
            playSFX("hit", 0.5);
            hapticFeedback(100);
        } else {
            r = "fail";
            playSFX("fail", 0.7);
            hapticFeedback(50);
        }

        setResult(r);

        // Delay before calling parent so player sees feedback
        setTimeout(() => onResult(r), 1200);
    }, [phase, cursorPos, onResult]);

    // ── Input listeners ──
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.key === " ") {
                e.preventDefault();
                if (phase === "ready") startGame();
                else if (phase === "running") stopCursor();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [phase, startGame, stopCursor]);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    // ── Computed values ──
    const tc = targetCenter.current;
    const successLeft = Math.max(0, tc - SUCCESS_RADIUS) * 100;
    const successWidth = Math.min(1, tc + SUCCESS_RADIUS) * 100 - successLeft;
    const perfectLeft = Math.max(0, tc - PERFECT_RADIUS) * 100;
    const perfectWidth = Math.min(1, tc + PERFECT_RADIUS) * 100 - perfectLeft;

    const resultLabel =
        result === "perfect"
            ? t("perfect")
            : result === "success"
                ? t("success")
                : result === "fail"
                    ? t("fail")
                    : null;

    const resultColor =
        result === "perfect"
            ? "text-amber-400"
            : result === "success"
                ? "text-emerald-400"
                : "text-red-400";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center gap-8 w-full max-w-xl mx-auto px-4"
            onPointerDown={() => {
                if (phase === "ready") startGame();
                else if (phase === "running") stopCursor();
            }}
        >
            {/* Title */}
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-serif font-bold text-foreground">
                    {t("title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {phase === "ready"
                        ? t("readyHint")
                        : phase === "running"
                            ? t("runningHint")
                            : ""}
                </p>
            </div>

            {/* QTE Bar */}
            <div className="w-full relative">
                {/* Background bar */}
                <div className="relative w-full h-10 rounded-full bg-black/60 border border-white/10 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                    {/* Success zone */}
                    <div
                        className="absolute top-0 h-full rounded-full bg-primary/15 border-y border-primary/20"
                        style={{ left: `${successLeft}%`, width: `${successWidth}%` }}
                    />
                    {/* Perfect zone */}
                    <div
                        className="absolute top-0 h-full rounded-sm bg-primary/30 border-2 border-primary/60 shadow-[0_0_12px_rgba(196,164,132,0.4)]"
                        style={{ left: `${perfectLeft}%`, width: `${perfectWidth}%` }}
                    />
                    {/* Cursor */}
                    <motion.div
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]",
                            result === "perfect"
                                ? "bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]"
                                : result === "success"
                                    ? "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]"
                                    : result === "fail"
                                        ? "bg-red-400 shadow-[0_0_20px_rgba(248,113,113,0.8)]"
                                        : "bg-white"
                        )}
                        style={{ left: `${cursorPos * 100}%` }}
                        animate={
                            result
                                ? { scale: [1, 1.8, 1], opacity: [1, 0.8, 1] }
                                : {}
                        }
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Zone labels */}
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground/50 uppercase tracking-widest px-1">
                    <span>0</span>
                    <span>{t("targetZone")}</span>
                    <span>100</span>
                </div>
            </div>

            {/* Result feedback */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn("text-3xl font-serif font-bold", resultColor)}
                    >
                        {resultLabel}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacebar hint */}
            {phase !== "stopped" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono">
                        {t("spaceKey")}
                    </kbd>
                    <span>{t("orTouch")}</span>
                </div>
            )}
        </motion.div>
    );
}
