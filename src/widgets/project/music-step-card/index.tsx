"use client";

import {
    ProjectNextLayoutButton,
    ProjectStepCard,
    useProjectGetById,
} from "@/entities/project";
import { useTaskStatus } from "@/entities/task";
import { useRouter } from "@/i18n/navigation";
import { TaskTypeEnum } from "@/shared/api";
import { getPath } from "@/shared/config";
import { Link, MusicPlayer } from "@/shared/ui";
import { Card, Flex, Text } from "@radix-ui/themes";
import { useIsMutating } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useMemo, type FC } from "react";

type Props = {
    active: boolean;
    projectId: string;
};

export const MusicStepCard: FC<Props> = ({ projectId, active }) => {
    const href = getPath("PROJECT_VIDEO_EDIT_MUSIC", { projectId });

    const pathname = usePathname();

    const { push } = useRouter();

    const isMutating = useIsMutating({ mutationKey: ["update", projectId] });

    const { data: project, isLoading: isProjectLoading } = useProjectGetById({
        id: projectId,
    });

    const { isPending, isExists } = useTaskStatus(
        TaskTypeEnum.SCRIPT2STORYBOARD_FLOW,
        project?.tasks,
    );

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!project) return;

        const routePath = getPath("PROJECT_VIDEO_EDIT_VIDEO", { projectId });

        push(routePath);
    };

    const isLoading = useMemo(() => {
        return (
            isProjectLoading ||
            (!!isMutating && pathname.endsWith("/edit/music"))
        );
    }, [isProjectLoading, isMutating, pathname]);

    return (
        <ProjectStepCard
            title="SOUNDTRACK"
            active={active}
            isVisible={!isPending && isExists}
            disabled={!isExists || isPending}
            hasTransition={!project?.music_id}
            loading={isLoading}
            id="step4"
            route={href}
        >
            <ProjectNextLayoutButton
                onClick={handleNext}
                title={!project?.music ? "SKIP" : "NEXT"}
                isVisible={isExists && active && !project?.config?.auto_mode}
            >
                <Card asChild>
                    <Link
                        href={href}
                        color="gray"
                        size="3"
                        className="p-0"
                    >
                        <Flex
                            py="3"
                            pl="5"
                            pr="6"
                            display="flex"
                            justify="between"
                            align="center"
                            gap="6"
                        >
                            <Flex flexGrow="1">
                                <MusicPlayer
                                    dense
                                    music={project?.music}
                                />
                            </Flex>
                            <Text color="lime">Edit</Text>
                        </Flex>
                    </Link>
                </Card>
            </ProjectNextLayoutButton>
        </ProjectStepCard>
    );
};
