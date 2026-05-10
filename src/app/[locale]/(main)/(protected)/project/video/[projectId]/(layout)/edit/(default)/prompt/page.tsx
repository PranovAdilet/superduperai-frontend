import { PromptEditPage } from "@/pages_/project-edit/video/prompt-edit-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <PromptEditPage {...params} />;
};

export default Page;
