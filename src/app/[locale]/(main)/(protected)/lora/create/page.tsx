import { LoraCreatePage } from "@/pages_/lora-create-page";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale });

    return {
        title: t("create.lora"),
    };
}

const Page = () => {
    return <LoraCreatePage />;
};

export default Page;
