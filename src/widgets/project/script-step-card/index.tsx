"use client";

import {
    ProjectNextLayoutButton,
    ProjectStepCard,
    useProjectGetById,
    useProjectScript,
    useScriptStore,
} from "@/entities/project";
import { useDataUpdate } from "@/features/data";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config";
import { Flex, Skeleton, Text } from "@radix-ui/themes";
import { type FC } from "react";

type Props = {
    active: boolean;
    projectId: string;
};

export const ScriptStepCard: FC<Props> = ({ projectId, active }) => {
    const router = useRouter();

    const href = getPath("PROJECT_VIDEO_EDIT_SCRIPT", { projectId });

    const { data: project, isLoading } = useProjectGetById({ id: projectId });

    const { text, data, isPending, isCompleted } = useProjectScript(project);

    const { mutate } = useDataUpdate();

    // const { isExists } = useTaskStatus(
    //     TaskTypeEnum.SCRIPT2ENTITIES_FLOW,
    //     project?.tasks,
    // );

    const { script: scriptText } = useScriptStore();

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!project || !data) return;

        const routePath = getPath("PROJECT_VIDEO_EDIT_STYLE", { projectId });

        const safeText = scriptText.replace(/\\</g, "<");

        mutate(
            {
                ...data,
                value: {
                    text: safeText,
                },
            },
            {
                onSuccess: () => {
                    router.push(routePath);
                },
            },
        );
    };

    return (
        <ProjectStepCard
            active={active}
            title="SCRIPT"
            actionBtn={
                <Text
                    color="lime"
                    weight="medium"
                >
                    EDIT
                </Text>
            }
            route={href}
            isGeneration={!isCompleted}
            generationTime="1-2 minutes"
            id="step1"
            loadingFallback={
                <Flex
                    direction="column"
                    gap="2"
                >
                    <Skeleton height="16px" />
                    <Skeleton
                        height="16px"
                        width="90%"
                    />
                    <Skeleton
                        height="16px"
                        width="98%"
                    />
                    <Skeleton
                        height="16px"
                        width="70%"
                    />
                    <Skeleton height="16px" />
                    <Skeleton
                        height="16px"
                        width="90%"
                    />
                </Flex>
            }
            loading={isPending || isLoading}
        >
            <ProjectNextLayoutButton
                onClick={handleNext}
                title="NEXT"
                isVisible={isCompleted && active && !project?.config?.auto_mode}
            >
                <Text
                    className="line-clamp-6 whitespace-pre-line"
                    color="gray"
                >
                    {text}
                </Text>
            </ProjectNextLayoutButton>
        </ProjectStepCard>
    );
};
