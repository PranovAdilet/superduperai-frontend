import TemplatesPage from "@/pages_/templates-page";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale });

    return {
        title: t("create.video"),
    };
}

export default function Page() {
    return <TemplatesPage />;
}
