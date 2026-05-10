import { LorasPage } from "@/pages_/loras-page";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale });

    return {
        title: t("lora"),
    };
}

const Page = () => {
    return <LorasPage />;
};

export default Page;
