import { MobileGeneratingProjectPage } from "@/pages_/mobile-generating-project-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <MobileGeneratingProjectPage {...params} />;
};

export default Page;
