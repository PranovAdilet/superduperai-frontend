import { PreviewPage } from "@/pages_/preview-page";
import type { PageProps } from "@/shared/types";
import { getTranslations } from "next-intl/server";

type Params = {
    projectId: string;
};

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale });

    return {
        title: t("preview"),
    };
}

const Page = ({ params }: PageProps<Params>) => {
    return <PreviewPage {...params} />;
};

export default Page;
