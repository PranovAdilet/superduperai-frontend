import { LoraCreatePage } from "@/pages_/lora-create-page";
import type { EntityTypeEnum } from "@/shared/api";
import type { PageProps } from "@/shared/types";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale, namespace: "lora" });

    return {
        title: t("myProjects"),
    };
}
type Params = {
    type: EntityTypeEnum;
};

const Page = ({ params }: PageProps<Params>) => {
    return <LoraCreatePage entityType={params.type} />;
};

export default Page;
