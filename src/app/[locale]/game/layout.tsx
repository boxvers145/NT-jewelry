import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "NT Jewelry | L'Aventure",
    description: "Explorez, craftez, combattez. Votre aventure de joaillier commence ici.",
};

export default function GameLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="game-hud-root h-screen w-screen overflow-hidden bg-[#050505] relative">
            {/* Immersive Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,164,132,0.08)_0%,_transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(196,164,132,0.04)_0%,_transparent_40%)] pointer-events-none" />

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(196,164,132,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(196,164,132,0.3) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            {children}
        </div>
    );
}
