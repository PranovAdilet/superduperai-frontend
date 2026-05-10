import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const handleI18nRouting = createMiddleware({
        ...routing, // Берем основные настройки locale, defaultLocale, localePrefix
        localeDetection: false, // Отключаем определение по Accept-Language header
    });
    const response = handleI18nRouting(request);

    return response;
}

export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
