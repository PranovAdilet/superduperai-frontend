import ImageWorkspacePage from "@/pages_/project-edit/image/image-workspace-page";
import type { PageProps } from "@/shared/types";

type Params = {
    projectId: string;
};

export default function Page({ params }: PageProps<Params>) {
    return <ImageWorkspacePage projectId={params.projectId} />;
}
