import StyleEditPage from "@/pages_/project-edit/video/style-edit-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <StyleEditPage {...params} />;
};

export default Page;
