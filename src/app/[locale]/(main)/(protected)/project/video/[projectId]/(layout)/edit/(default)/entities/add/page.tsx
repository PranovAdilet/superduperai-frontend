import { EntitiesAddPage } from "@/pages_/project-edit/video/entities-add-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <EntitiesAddPage {...params} />;
};

export default Page;
