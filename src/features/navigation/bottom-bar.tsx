"use client";

import { Home, Search, ShoppingBag, User } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { AccessButton } from "@/features/game-ui/access-button";
import { useTranslations } from "next-intl";

export function BottomBar() {
    const pathname = usePathname();
    const t = useTranslations("nav");

    const links = [
        { href: "/" as const, icon: Home, label: t("home") },
        { href: "/catalog" as const, icon: Search, label: t("explore") },
        { href: "/cart" as const, icon: ShoppingBag, label: t("cart") },
        { href: "/profile" as const, icon: User, label: t("profile") },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-white/5 md:hidden">
            <div className="flex justify-around items-center h-16 px-2 pb-[env(safe-area-inset-bottom)]">
                {/* First two links */}
                {links.slice(0, 2).map((link) => (
                    <BottomLink key={link.href} {...link} pathname={pathname} />
                ))}

                {/* Center Game Button */}
                <div className="-mt-6">
                    <AccessButton className="w-14 h-14 bg-background border-primary shadow-[0_0_20px_rgba(196,164,132,0.3)]" />
                </div>

                {/* Last two links */}
                {links.slice(2).map((link) => (
                    <BottomLink key={link.href} {...link} pathname={pathname} />
                ))}
            </div>
        </nav>
    );
}

// Extracted for cleaner render
function BottomLink({ href, icon: Icon, label, pathname }: any) {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    return (
        <Link
            href={href}
            className="relative flex flex-col items-center justify-center w-full h-full"
        >
            <div className="relative flex flex-col items-center gap-0.5">
                {isActive && (
                    <motion.div
                        layoutId="bottombar-active"
                        className="absolute -top-1.5 w-6 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                )}
                <Icon
                    className={cn(
                        "w-5 h-5 transition-colors duration-200",
                        isActive ? "text-primary" : "text-muted-foreground"
                    )}
                />
                <span
                    className={cn(
                        "text-[10px] font-medium transition-colors duration-200",
                        isActive ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    {label}
                </span>
            </div>
        </Link>
    );
}
