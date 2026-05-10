import EntityEditPage from "@/pages_/project-edit/video/entity-edit-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
    entityId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <EntityEditPage {...params} />;
};

export default Page;
