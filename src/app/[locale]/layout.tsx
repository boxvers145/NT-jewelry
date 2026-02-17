import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { BottomBar } from "@/features/navigation/bottom-bar";
import { DesktopHeader } from "@/features/navigation/desktop-header";
import { PWAInstallPrompt } from "@/components/pwa/InstallPrompt";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { routing } from "@/i18n/routing";

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

import { PersonaTransition } from "@/shared/ui/persona-transition";

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
                <PersonaTransition />
                <DesktopHeader />
                <main className="flex-1 flex flex-col md:pt-20 pb-20 md:pb-0">
                    {children}
                </main>
                <BottomBar />
                <PWAInstallPrompt />
                <Toaster position="top-center" richColors theme="dark" />
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}
