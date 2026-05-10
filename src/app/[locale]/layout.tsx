import type { ReactNode } from "react";

import { Theme } from "@radix-ui/themes";
import { QueryProvider } from "@/shared/providers";
import { GoogleTagManager } from "@/shared/config";
import { TokenProvider } from "@/features/auth";
import banner from "@/../public/banner.webp";
import neuroBanner from "@/../public/neuroStudio/logo.svg";
import { getMessages, getTranslations } from "next-intl/server";
import "@/shared/styles/index.scss";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

type Props = {
    children: ReactNode;
    params: { locale: string };
};

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale, namespace: "metadata" });
    const bannerUrl =
        process.env.NEXT_PUBLIC_PROJECT_TYPE === "neuroStudio"
            ? neuroBanner.src
            : banner.src;

    const url =
        process.env.NEXT_PUBLIC_PROJECT_TYPE === "neuroStudio"
            ? "/neuroStudio/neurostudio.xyz.png"
            : "/logo.svg";
    return {
        title: t("title"),
        description: t("description"),
        manifest: "/manifest.json",
        keywords: ["nextjs", "pwa", "next-pwa"],
        icons: [{ rel: "icon", url: url }],
        metadataBase: new URL(
            process.env.NEXT_PUBLIC_SITE_URL ?? t("metadataBase"),
        ),
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            images: [
                {
                    url: bannerUrl,
                    width: 1200,
                    height: 630,
                    type: "image/png",
                },
            ],
            url: t("ogUrl"),
            type: "website",
        },
        twitter: {
            card: "summary",
            title: t("twitterTitle"),
            description: t("twitterDescription"),
        },
    };
}

export default async function RootLayout({
    children,
    params: { locale },
}: Readonly<Props>) {
    let messages;
    try {
        messages = await getMessages({ locale });
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
        >
            <Theme
                accentColor="lime"
                grayColor="mauve"
                panelBackground="solid"
                radius="large"
                appearance="dark"
            >
                <QueryProvider>
                    <GoogleTagManager />
                    {/* <TokenProvider>{children}</TokenProvider> */}
                    {children}
                </QueryProvider>
            </Theme>
        </NextIntlClientProvider>
    );
}
