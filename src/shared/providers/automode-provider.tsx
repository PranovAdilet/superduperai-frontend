"use client";

import { useProjectGetById, useProjectTasks } from "@/entities/project";
import { useProjectUpdate } from "@/features/project";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
    useProjectScript2Storyboard,
    useProjectVideoScript2Entities,
} from "@/features/project-video";
import { useProjectTxt2Script } from "@/features/project-video/txt2script";
import { getPath } from "../config";
import { useRouter } from "@/i18n/navigation";

type Props = {
    children: ReactNode;
    projectId: string;
};
//TODO:Переместить куда-нибудь из shared, так как провайдер использует хуки из features и entities

export const AutoModeProvider = ({ children, projectId }: Props) => {
    const pathname = usePathname();

    const { push } = useRouter();

    const { data: project } = useProjectGetById({ id: projectId });

    const { mutate: update, isPending } = useProjectUpdate();

    const {
        mutate: regenerateStoryboard,
        isPending: isStoryboardRegenerating,
    } = useProjectScript2Storyboard();

    const { mutate: regenerateEntities, isPending: isEntitiesRegenerating } =
        useProjectVideoScript2Entities();

    const { mutate: regenerateTxt } = useProjectTxt2Script();

    const {
        isTxtCompleted,
        isTxtError,
        isEntityCompleted,
        isEntityExists,
        isEntityError,
        isStoryboardCompleted,
        isStoryboardExists,
        isStoryboardError,

        tasks,
        completedTasks,
        errorTasks,
    } = useProjectTasks(project?.tasks);

    const [isGenerating, setIsGenerating] = useState(false);

    const [isAutoMode, setIsAutoMode] = useState(false);

    useEffect(() => {
        if (project?.config?.auto_mode) {
            setIsAutoMode(true);
        } else {
            setIsAutoMode(false);
        }
    }, [project?.config?.auto_mode]);

    useEffect(() => {
        if (!isAutoMode || !isGenerating) return;

        if (isStoryboardCompleted && pathname.endsWith("/edit/storyboard")) {
            push(getPath("PROJECT_VIDEO_EDIT_VIDEO", { projectId }));
            return;
        }

        if (isEntityCompleted && !isStoryboardExists) {
            push(getPath("PROJECT_VIDEO_EDIT_STORYBOARD_ROOT", { projectId }));

            return;
        }

        if (isTxtCompleted && !isEntityExists) {
            push(getPath("PROJECT_VIDEO_EDIT_ENTITIES", { projectId }));

            return;
        }
    }, [
        isGenerating,
        isAutoMode,
        isTxtCompleted,
        isEntityCompleted,
        isStoryboardCompleted,
    ]);

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

    const handleDisableAutoMode = () => {
        if (!project) return;
        update({
            ...project,
            id: projectId,
            config: {
                ...project.config,
                auto_mode: false,
            },
        });
        setIsAutoMode(false);
    };

    useEffect(() => {
        if (project?.tasks) {
            const generating = tasks.some((task) => task.pending);

            setIsGenerating(completedTasks.length < 3 || generating);
        }
    }, [project?.tasks]);

    return (
        <Flex
            flexGrow="1"
            position="relative"
        >
            {isAutoMode && isGenerating && (
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    mx="5"
                    width="100%"
                    height="100%"
                    justify="center"
                    align="center"
                    className="z-50 bg-[rgba(0,0,0,0.8)]"
                    gap="4"
                    direction="column"
                >
                    <Text align="center">
                        {errorTasks.length
                            ? "Something went wrong. You can disable auto mode or try to regenerate"
                            : "Auto mode is currently enabled. To disable it, click the button below."}
                    </Text>
                    <Flex gap="3">
                        {errorTasks.length ? (
                            <Button
                                onClick={handleRegenerate}
                                loading={
                                    isEntitiesRegenerating ||
                                    isStoryboardRegenerating
                                }
                                color="gray"
                            >
                                Regenerate
                            </Button>
                        ) : (
                            <></>
                        )}
                        <Button
                            onClick={handleDisableAutoMode}
                            loading={isPending}
                        >
                            Disable Auto Mode
                        </Button>
                    </Flex>
                    <Text
                        size="3"
                        color="gray"
                        align="center"
                    >
                        {completedTasks.length}/3 steps completed
                    </Text>
                </Flex>
            )}
            {children}
        </Flex>
    );
};
