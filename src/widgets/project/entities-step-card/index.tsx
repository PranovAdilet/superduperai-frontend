"use client";
import { useEntityList } from "@/entities/entity";
import {
    ProjectNextLayoutButton,
    ProjectStepCard,
    useProjectGetById,
} from "@/entities/project";
import { useTaskStatus } from "@/entities/task";
import { useProjectScript2Storyboard } from "@/features/project-video";
import { useRouter } from "@/i18n/navigation";
import { TaskTypeEnum } from "@/shared/api";
import { getPath } from "@/shared/config";
import { Skeleton } from "@radix-ui/themes";
import { useIsMutating } from "@tanstack/react-query";
import { type FC } from "react";

type Props = {
    active: boolean;
    projectId: string;
};

export const EntitiesStepCard: FC<Props> = ({ projectId, active }) => {
    const { push } = useRouter();

    const { data, isLoading } = useEntityList({ projectId });

    const { data: project } = useProjectGetById({ id: projectId });

    const { isPending, isCompleted, isExists } = useTaskStatus(
        TaskTypeEnum.SCRIPT2ENTITIES_FLOW,
        project?.tasks,
    );

    const { mutateAsync: storyboard } = useProjectScript2Storyboard([
        TaskTypeEnum.SCRIPT2STORYBOARD_FLOW,
        projectId,
    ]);

    const { isExists: isStoryboardExists } = useTaskStatus(
        TaskTypeEnum.SCRIPT2STORYBOARD_FLOW,
        project?.tasks,
    );

    const isMutating = useIsMutating({
        mutationKey: [TaskTypeEnum.SCRIPT2STORYBOARD_FLOW, projectId],
    });

    const loading = isLoading || (isPending && data?.items.length === 0);

    const href = getPath("PROJECT_VIDEO_EDIT_ENTITIES", { projectId });

    const nextRoutePath = getPath("PROJECT_VIDEO_EDIT_STORYBOARD_ROOT", {
        projectId,
    });

    const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            if (!isStoryboardExists) {
                await storyboard({
                    ...project,
                    id: projectId,
                });
            }
        } catch (error: unknown) {
            console.error("Failed to generate storyboard:", error);
        }
        push(nextRoutePath);
    };

    return (
        <ProjectStepCard
            title="ENTITIES"
            active={active}
            loading={loading}
            isGeneration={isPending}
            disabled={!isExists}
            generationTime="2-5 minutes"
            loadingFallback={[...Array(3)].map((_, index) => (
                <Skeleton
                    key={index}
                    className="rounded-xl"
                    height="84px"
                />
            ))}
            route={href}
            isVisible={isExists}
            hasTransition={!isCompleted}
            id="step3"
        >
            {data?.items.length === 0 && (
                <ProjectStepCard.Item title="No entities" />
            )}
            <ProjectNextLayoutButton
                onClick={handleNext}
                title="NEXT"
                isVisible={isCompleted && active && !project?.config?.auto_mode}
                loading={!!isMutating}
            >
                {data?.items.slice(0, 3).map((item) => (
                    <ProjectStepCard.Item
                        key={item.id}
                        title={item.name}
                        type={item.file?.type}
                        thumbnail={item.file?.url?.toString()}
                        // href={getPath("PROJECT_VIDEO_EDIT_ENTITY_DETAIL", {
                        //     projectId,
                        //     entityId: item.id,
                        // })}
                    />
                ))}
            </ProjectNextLayoutButton>
        </ProjectStepCard>
    );
};
