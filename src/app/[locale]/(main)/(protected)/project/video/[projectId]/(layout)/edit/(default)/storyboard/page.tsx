import StoryboardStepPage from "@/pages_/project-edit/video/storyboard-step-page/ui";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Storyboard = ({ params }: PageProps<Params>) => {
    return <StoryboardStepPage {...params} />;
};

export default Storyboard;
