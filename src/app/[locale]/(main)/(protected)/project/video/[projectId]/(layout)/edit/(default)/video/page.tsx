import VideoEditPage from "@/pages_/project-edit/video/video-edit-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <VideoEditPage {...params} />;
};

export default Page;
