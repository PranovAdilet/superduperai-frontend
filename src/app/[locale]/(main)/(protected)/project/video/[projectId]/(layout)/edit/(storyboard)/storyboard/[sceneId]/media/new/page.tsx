import StoryboardSceneMediaNewPage from "@/pages_/project-edit/video/storyboard-scene-media-new-page";
import type { PageProps } from "@/shared/types";

type Params = {
    sceneId: string;
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <StoryboardSceneMediaNewPage {...params} />;
};

export default Page;
