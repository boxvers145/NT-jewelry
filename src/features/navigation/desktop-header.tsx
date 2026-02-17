"use client";

import { Link } from "@/i18n/navigation";
import { ShoppingBag, User } from "lucide-react";
import { AccessButton } from "@/features/game-ui/access-button";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { LanguageSwitcher } from "@/shared/ui/language-switcher";
import { useTranslations } from "next-intl";

export function DesktopHeader() {
    const t = useTranslations("nav");

    return (
        <header className="fixed top-0 left-0 right-0 z-50 hidden md:block bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-foreground hover:text-primary transition-colors">
                    NT Jewelry
                </Link>
                <nav className="flex items-center gap-8">
                    <Link href="/catalog" className="text-sm font-medium tracking-wide hover:text-primary transition-colors">
                        {t("collections")}
                    </Link>
                    <Link href="/maison" className="text-sm font-medium tracking-wide hover:text-primary transition-colors">
                        {t("maison")}
                    </Link>
                    <div className="flex items-center gap-4 ml-8 border-l border-white/10 pl-8">
                        <Link href="/cart" className="relative group">
                            <ShoppingBag className="w-5 h-5 group-hover:text-primary transition-colors" />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                        </Link>
                        <Link href="/profile" className="group">
                            <User className="w-5 h-5 group-hover:text-primary transition-colors" />
                        </Link>
                        {/* THE WORKSHOP ACCESS */}
                        <AccessButton />
                        <div className="border-l border-white/10 pl-4 flex items-center gap-2">
                            <ThemeToggle />
                            <LanguageSwitcher />
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}
