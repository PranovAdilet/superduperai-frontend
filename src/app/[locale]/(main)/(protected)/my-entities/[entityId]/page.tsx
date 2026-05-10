import EntityEditPage from "@/pages_/project-edit/video/entity-edit-page";
import type { PageProps } from "@/shared/types";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale });

    return {
        title: t("myEntities"),
    };
}

type Params = {
    entityId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <EntityEditPage {...params} />;
};

export default Page;
