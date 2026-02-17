// ─── SFX & Haptic Utility ────────────────────────────────
// Fire-and-forget sound player + haptic feedback for mobile.
// Silently no-ops if audio files are missing or vibration unsupported.

const audioCache = new Map<string, HTMLAudioElement>();

/**
 * Plays a short sound effect from `/sounds/{name}.mp3`.
 * Creates a cloned audio node each call so overlapping plays work.
 */
export function playSFX(name: string, volume: number = 0.6): void {
    if (typeof window === "undefined") return;

    try {
        let source = audioCache.get(name);
        if (!source) {
            source = new Audio(`/sounds/${name}.mp3`);
            audioCache.set(name, source);
        }
        // Clone so multiple can play simultaneously
        const clone = source.cloneNode() as HTMLAudioElement;
        clone.volume = Math.min(1, Math.max(0, volume));
        clone.play().catch(() => {
            /* user hasn't interacted yet or file missing — swallow */
        });
    } catch {
        /* no-op */
    }
}

/**
 * Triggers haptic feedback on supported devices.
 * @param pattern - vibration pattern in ms, e.g. [200] or [100, 50, 100]
 */
export function hapticFeedback(pattern: number | number[] = 200): void {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
            navigator.vibrate(pattern);
        } catch {
            /* no-op */
        }
    }
}
