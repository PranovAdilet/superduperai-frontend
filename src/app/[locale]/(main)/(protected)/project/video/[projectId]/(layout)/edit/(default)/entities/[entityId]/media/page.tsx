import { EntityMediaListPage } from "@/pages_/project-edit/video/entity-media-list-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
    entityId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <EntityMediaListPage {...params} />;
};

export default Page;
