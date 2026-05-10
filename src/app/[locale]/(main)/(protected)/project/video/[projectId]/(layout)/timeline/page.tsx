import { ProjectTimelinePage } from "@/pages_/project-edit/video/project-timeline-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <ProjectTimelinePage {...params} />;
};

export default Page;
