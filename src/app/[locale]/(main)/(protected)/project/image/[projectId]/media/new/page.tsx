import ProjectMediaNewPage from "@/pages_/project-edit/image/project-media-new-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

export default function Page({ params }: PageProps<Params>) {
    return <ProjectMediaNewPage projectId={params.projectId} />;
}
