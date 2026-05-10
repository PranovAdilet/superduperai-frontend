import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "ru", "es", "tr", "zh", "hi", "uk"],
    defaultLocale: "en",
    localePrefix: "as-needed", // Возвращаем управление префиксами
});
