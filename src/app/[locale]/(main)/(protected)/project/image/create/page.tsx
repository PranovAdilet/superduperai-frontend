import ImageGenerationPage from "@/pages_/project-edit/image/image-generation-page";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale });

    return {
        title: t("create.image"),
    };
}

export default function Page() {
    return <ImageGenerationPage />;
}
