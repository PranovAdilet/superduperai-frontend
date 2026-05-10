import { EntityMediaListPage } from "@/pages_/project-edit/video/entity-media-list-page";
import type { PageProps } from "@/shared/types";

type Params = {
    entityId: string;
};

export default function Page({ params }: PageProps<Params>) {
    return <EntityMediaListPage {...params} />;
}
