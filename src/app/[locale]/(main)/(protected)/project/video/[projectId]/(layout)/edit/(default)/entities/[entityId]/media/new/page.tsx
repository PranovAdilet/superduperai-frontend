import EntityMediaNewPage from "@/pages_/project-edit/video/entity-media-new-page";
import type { PageProps } from "@/shared/types";

type Params = {
    entityId: string;
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <EntityMediaNewPage {...params} />;
};

export default Page;
