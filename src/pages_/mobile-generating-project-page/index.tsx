"use client";

import { useProjectGetById, useProjectTasks } from "@/entities/project";
import {
    useProjectScript2Storyboard,
    useProjectVideoScript2Entities,
} from "@/features/project-video";
import { useProjectTxt2Script } from "@/features/project-video/txt2script";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config/routes";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useEffect, type FC } from "react";

type Props = {
    projectId: string;
};

export const MobileGeneratingProjectPage: FC<Props> = ({ projectId }) => {
    const { replace } = useRouter();

    const {
        mutate: regenerateStoryboard,
        isPending: isStoryboardRegenerating,
    } = useProjectScript2Storyboard();

    const { mutate: regenerateEntities, isPending: isEntitiesRegenerating } =
        useProjectVideoScript2Entities();

    const { mutate: regenerateTxt, isPending: isTxtRegenerating } =
        useProjectTxt2Script();

    const { data: project } = useProjectGetById({ id: projectId });
    const {
        isEntityError,
        isStoryboardError,
        errorTasks,
        completedTasks,
        isEntityCompleted,
        isStoryboardCompleted,
        isTxtCompleted,
        isTxtError,
    } = useProjectTasks(project?.tasks);

    const handleRegenerate = () => {
        if (isTxtError) {
            regenerateTxt({
                id: projectId,
                requestBody: project?.config?.prompt,
            });
            return;
        }
        if (isEntityError) {
            regenerateEntities({ id: projectId });
            return;
        }
        if (isStoryboardError) {
            regenerateStoryboard({ id: projectId });
            return;
        }
    };

    useEffect(() => {
        if (isStoryboardCompleted && isEntityCompleted && isTxtCompleted) {
            replace(getPath("PREVIEW_PROJECT", { projectId }));
        }
    }, [isStoryboardCompleted]);

    return (
        <Flex
            flexGrow="1"
            p="6"
            direction="column"
            justify="center"
            align="center"
            gap="2"
        >
            <Text align="center">
                {errorTasks.length
                    ? "An error occurred. Please try regenerating the project."
                    : "Auto mode is active. Please wait while your project is being prepared."}
            </Text>
            <Flex gap="3">
                {errorTasks.length ? (
                    <Button
                        onClick={handleRegenerate}
                        loading={
                            isEntitiesRegenerating ||
                            isStoryboardRegenerating ||
                            isTxtRegenerating
                        }
                        color="gray"
                    >
                        Regenerate
                    </Button>
                ) : (
                    <></>
                )}
            </Flex>
            <Text
                size="3"
                color="gray"
                align="center"
            >
                {completedTasks.length}/3 steps completed
            </Text>
        </Flex>
    );
};

export default MobileGeneratingProjectPage;
