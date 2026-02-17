"use client";

import { useConfetti } from "@/shared/hooks/use-confetti";
import { Button } from "@/shared/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function Home() {
  const { triggerConfetti } = useConfetti();
  const t = useTranslations("hero");
  const tc = useTranslations("common");

  useEffect(() => {
    toast.success(tc("welcome"), {
      description: tc("welcomeDesc"),
    });
  }, [tc]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => triggerConfetti()}
          size="lg"
          className="rounded-full px-8 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all"
        >
          {t("cta")}
        </Button>
        <Button variant="outline" size="lg" className="rounded-full px-8">
          {t("about")}
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
