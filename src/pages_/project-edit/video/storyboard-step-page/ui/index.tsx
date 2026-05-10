"use client";

import {
    ProjectNextBtn,
    ProjectStep,
    useProjectGetById,
} from "@/entities/project";
import { useTaskStatus } from "@/entities/task";
import { useUserMe } from "@/entities/user";
import {
    ProjectVideoAnimateAllDialog,
    useProjectScript2Storyboard,
} from "@/features/project-video";
import { useRouter } from "@/i18n/navigation";
import { TaskTypeEnum } from "@/shared/api";
import { getPath } from "@/shared/config/routes";
import { useModal } from "@/shared/store";
import { RegenerateErrorButton, SuspenseQuery } from "@/shared/ui";
import { SceneStoryboardList } from "@/widgets/scene";
import { Button, Flex, Text } from "@radix-ui/themes";
import { RotateCcw, Sparkles } from "lucide-react";
import { useEffect, type FC } from "react";

type Props = {
    projectId: string;
};
const StoryboardStepPage: FC<Props> = ({ projectId }) => {
    const { push, prefetch } = useRouter();

    const { open } = useModal();

    const { mutate: regenerateStoryboard, isPending: isTxtPending } =
        useProjectScript2Storyboard();

    const { data: project, refetch } = useProjectGetById({ id: projectId });

    const { data: user } = useUserMe();

    const {
        isPending: isTaskPending,
        isError: isScript2StoryboardError,
        isCompleted,
    } = useTaskStatus(TaskTypeEnum.SCRIPT2STORYBOARD_FLOW, project?.tasks);

    const routePath = getPath("PROJECT_VIDEO_EDIT_MUSIC", { projectId });

    useEffect(() => {
        prefetch(routePath);
    }, [prefetch, projectId, routePath]);

    const handleNext = () => {
        push(routePath);
    };

    const handleRegenerate = () => {
        regenerateStoryboard({
            id: projectId,
        });
    };

    const handleAnimateAll = () => {
        open("projectVideoAnimateAllDialog", { projectId });
    };

    const isPending = isTxtPending || isTaskPending;

    return (
        <ProjectStep>
            <ProjectVideoAnimateAllDialog />
            <ProjectStep.Root>
                <Flex
                    px="6"
                    pt="6"
                >
                    <SuspenseQuery
                        refetch={refetch}
                        isError={isScript2StoryboardError}
                        fallbackError={() => (
                            <RegenerateErrorButton
                                isPending={isPending}
                                onRegenerate={handleRegenerate}
                            />
                        )}
                    >
                        <SceneStoryboardList
                            readonly={isPending}
                            projectId={projectId}
                        />
                    </SuspenseQuery>
                </Flex>
            </ProjectStep.Root>
            <ProjectStep.Footer>
                <Flex
                    align="center"
                    justify="between"
                    width="100%"
                >
                    <Flex gap="4">
                        {user?.admin && (
                            <Button
                                color="gray"
                                size="2"
                                loading={isPending}
                                onClick={handleRegenerate}
                            >
                                <RotateCcw size="16px" />
                                <Text size="4">Regenerate</Text>
                            </Button>
                        )}

                        <Button
                            size="2"
                            color="gray"
                            onClick={handleAnimateAll}
                            disabled={isPending || !isCompleted}
                        >
                            <Sparkles size="16px" />
                            <Text size="4">Animate all</Text>
                        </Button>
                    </Flex>
                    <ProjectNextBtn
                        onClick={handleNext}
                        disabled={isPending || !isCompleted}
                    />
                </Flex>
            </ProjectStep.Footer>
        </ProjectStep>
    );
};

export default StoryboardStepPage;
