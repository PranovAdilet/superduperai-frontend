import TemplatePage from "@/pages_/template-page";
import type { PageProps } from "@/shared/types";
import { getTranslations } from "next-intl/server";

type Params = {
    templateName: string;
    locale: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <TemplatePage {...params} />;
};

export default Page;

export async function generateMetadata({
    params: { locale, templateName: template },
}: PageProps<Params>) {
    const t = await getTranslations({ locale });

    const templateName =
        createProjectType[template as keyof typeof createProjectType];

    return {
        title: t("create.template", { templateName }),
    };
}

const createProjectType = {
    real_estate: "Real Estate",
    story: "Story",
    startup_pitch: "Startup Pitch",
    fairy_tale: "Fairy Tail",
    music_clip: "Music Clip",
    educational_video: "Educational Video",
};
