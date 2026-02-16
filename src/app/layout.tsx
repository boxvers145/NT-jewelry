import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import { BottomBar } from "@/features/navigation/bottom-bar";
import { DesktopHeader } from "@/features/navigation/desktop-header";
import "./globals.css";
import { cn } from "@/shared/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "NT Jewelry | L'Écrin Digital",
  description:
    "Haute Joaillerie Contemporaine. Une expérience immersive entre luxe et culture pop.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          montserrat.className,
          playfair.variable,
          "bg-background text-foreground antialiased min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary"
        )}
      >
        <DesktopHeader />
        <main className="flex-1 flex flex-col md:pt-20 pb-20 md:pb-0">
          {children}
        </main>
        <BottomBar />
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
