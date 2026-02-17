"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
    fr: "Français",
    en: "English",
};

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale as "fr" | "en" });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Change language"
                    className="relative"
                >
                    <Globe className="w-4 h-4" />
                    <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold text-primary uppercase leading-none">
                        {locale}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="min-w-[140px] bg-card/95 backdrop-blur-xl border-primary/10"
            >
                {routing.locales.map((loc) => (
                    <DropdownMenuItem
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={
                            loc === locale
                                ? "text-primary font-semibold"
                                : "text-foreground/80"
                        }
                    >
                        {LOCALE_LABELS[loc]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
