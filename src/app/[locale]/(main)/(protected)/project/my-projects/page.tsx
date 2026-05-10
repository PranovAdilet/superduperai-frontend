import { MyProjectsPage } from "@/pages_/my-projects-page";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale });

    return {
        title: t("myProjects"),
    };
}

const Page = () => {
    return <MyProjectsPage />;
};

export default Page;
