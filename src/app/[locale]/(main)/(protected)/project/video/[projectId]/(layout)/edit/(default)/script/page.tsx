import ScriptEditPage from "@/pages_/project-edit/video/script-edit-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <ScriptEditPage {...params} />;
};

export default Page;
