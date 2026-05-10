import StoryboardScenePage from "@/pages_/project-edit/video/storyboard-scene-page";
import type { PageProps } from "@/shared/types";

type Params = {
    sceneId: string;
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <StoryboardScenePage {...params} />;
};

export default Page;
