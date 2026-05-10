import { StoryboardSceneVoiceoverNewPage } from "@/pages_/project-edit/video/storyboard-scene-voiceover-new-page";
import type { PageProps } from "@/shared/types";

type Params = {
    sceneId: string;
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <StoryboardSceneVoiceoverNewPage {...params} />;
};

export default Page;
