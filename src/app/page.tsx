"use client";

import { useConfetti } from "@/shared/hooks/use-confetti";
import { Button } from "@/shared/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Home() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    // Welcome toast
    toast.success("Welcome to NT Jewelry!", {
      description: "Experience luxury gaming interactions.",
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Level Up Your Style
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Premium jewelry for the modern gamer. Crafted with precision, worn with pride.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => triggerConfetti()}
          size="lg"
          className="rounded-full px-8 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all"
        >
          Explore Collection
        </Button>
        <Button variant="outline" size="lg" className="rounded-full px-8">
          About Us
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square rounded-2xl bg-muted/50 border border-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
