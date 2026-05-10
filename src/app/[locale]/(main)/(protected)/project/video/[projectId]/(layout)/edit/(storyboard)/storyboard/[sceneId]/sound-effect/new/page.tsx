import { StoryboardSceneSoundEffectNewPage } from "@/pages_/project-edit/video/storyboard-scene-sound-effect-new-page";
import type { PageProps } from "@/shared/types";

type Params = {
    sceneId: string;
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <StoryboardSceneSoundEffectNewPage {...params} />;
};

export default Page;
