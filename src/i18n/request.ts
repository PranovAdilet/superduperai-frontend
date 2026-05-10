import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = routing.locales.includes(requested as "ru" | "en")
        ? requested
        : routing.defaultLocale;
    const type = process.env.NEXT_PUBLIC_PROJECT_TYPE ?? "superDuper";

    return {
        locale,
        messages: (await import(`../../messages/${type}/${locale}.json`))
            .default,
    };
});
