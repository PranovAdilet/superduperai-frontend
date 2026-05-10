import EntitiesListPage from "@/pages_/project-edit/video/entities-list-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <EntitiesListPage {...params} />;
};

export default Page;
