import confetti from "canvas-confetti";
import { useCallback } from "react";

export const useConfetti = () => {
    const triggerConfetti = useCallback((options?: confetti.Options) => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            ...options,
        });
    }, []);

    return { triggerConfetti };
};
