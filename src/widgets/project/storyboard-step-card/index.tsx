"use client";
import {
    ProjectNextLayoutButton,
    ProjectStepCard,
    useProjectGetById,
} from "@/entities/project";
import { useSceneList } from "@/entities/scene";
import { Image, Link } from "@/shared/ui";
import { Card, Flex, Text } from "@radix-ui/themes";
import type { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { useTaskStatus } from "@/entities/task";
import { TaskTypeEnum } from "@/shared/api";
import { getPath } from "@/shared/config";
import { useRouter } from "@/i18n/navigation";

type Props = {
    active: boolean;
    projectId: string;
};

export const StoryboardStepCard: FC<Props> = ({ projectId, active }) => {
    const { push } = useRouter();

    const { data: scenes, isLoading } = useSceneList({ projectId });

    const { data: project } = useProjectGetById({ id: projectId });

    const {
        isPending: isStoryboardPending,
        isExists,
        isCompleted,
    } = useTaskStatus(TaskTypeEnum.SCRIPT2STORYBOARD_FLOW, project?.tasks);

    const files = scenes?.items.map((scene) => {
        if ("file" in scene) {
            return {
                url: scene.file?.thumbnail_url ?? scene.file?.url,
                type: scene.file?.type,
            };
        }
    });

    const lastFile = files?.[files.length - 1];

    const href = getPath("PROJECT_VIDEO_EDIT_STORYBOARD_ROOT", { projectId });

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!project || !isCompleted) return;

        const routePath = getPath("PROJECT_VIDEO_EDIT_MUSIC", { projectId });

        push(routePath);
    };

    return (
        <ProjectStepCard
            title="STORYBOARD"
            active={active}
            isGeneration={isStoryboardPending}
            generationTime="2-5 minutes"
            loading={isLoading || isStoryboardPending}
            isVisible={isExists}
            hasTransition={!isCompleted}
            disabled={!isExists}
            id="step5"
            route={href}
        >
            <ProjectNextLayoutButton
                onClick={handleNext}
                title="NEXT"
                isVisible={isCompleted && active && !project?.config?.auto_mode}
            >
                <Card asChild>
                    <Link
                        href={href}
                        color="gray"
                        size="3"
                    >
                        <Flex
                            px="3"
                            display="flex"
                            justify="between"
                            align="center"
                            gap="6"
                        >
                            <Flex
                                flexGrow="1"
                                align="center"
                                position="relative"
                            >
                                {files?.slice(0, 3).map((file, index) => (
                                    <Image
                                        width="60px"
                                        height="60px"
                                        src={file?.url}
                                        key={index}
                                        className="rounded-full bg-black"
                                        style={{
                                            marginLeft:
                                                index !== 0 ? -40 : undefined,
                                            zIndex: files.length - index,
                                        }}
                                    />
                                ))}
                                {files && files.length > 3 && (
                                    <Image
                                        src={lastFile?.url}
                                        width="60px"
                                        height="60px"
                                        className="ml-3 rounded-full"
                                    >
                                        <Text
                                            as="p"
                                            size="7"
                                            className={clsx(
                                                styles["text-outline"],
                                                "absolute rounded-full px-1 text-white",
                                            )}
                                        >
                                            +{files.length - 3}
                                        </Text>
                                    </Image>
                                )}
                            </Flex>

                            <Text color="lime">Edit</Text>
                        </Flex>
                    </Link>
                </Card>
            </ProjectNextLayoutButton>
        </ProjectStepCard>
    );
};
