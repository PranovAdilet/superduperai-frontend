import { MyEntitiesPage } from "@/pages_/my-entities-page";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale });

    return {
        title: t("myEntities"),
    };
}

const Page = () => {
    return <MyEntitiesPage />;
};

export default Page;
