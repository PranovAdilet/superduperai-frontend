"use client";

import { BackButton } from "@/shared/ui";
import { MyEntitiesList } from "@/widgets/entity";
import { Flex, Separator } from "@radix-ui/themes";
import { getPath } from "@/shared/config/routes";
import type { FC } from "react";

type Props = {
    projectId: string;
};

export const EntitiesAddPage: FC<Props> = ({ projectId }) => {
    const backRoute = getPath("PROJECT_VIDEO_EDIT_ENTITIES", { projectId });

    return (
        <Flex
            direction="column"
            gap="5"
            width="100%"
            py="5"
            px="6"
        >
            <Flex
                gap="2"
                direction="column"
            >
                <BackButton route={backRoute} />
                <Separator size="4" />
            </Flex>
            <MyEntitiesList projectId={projectId} />
        </Flex>
    );
};

export default EntitiesAddPage;
