import EntityMediaNewPage from "@/pages_/project-edit/video/entity-media-new-page";
import type { PageProps } from "@/shared/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SuperDuperAi | My Entities",
};

type Params = {
    entityId: string;
};

const Page = ({ params }: PageProps<Params>) => {
    return <EntityMediaNewPage {...params} />;
};

export default Page;
