import MusicEditPage from "@/pages_/project-edit/video/music-edit-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <MusicEditPage {...params} />;
};

export default Page;
