"use client";

import {
    ProjectNextLayoutButton,
    ProjectStepCard,
    useProjectGetById,
} from "@/entities/project";
import { useTaskStatus } from "@/entities/task";
import { useProjectVideoScript2Entities } from "@/features/project-video";
import { useRouter } from "@/i18n/navigation";
import { TaskTypeEnum } from "@/shared/api";
import { getPath } from "@/shared/config";
import { useIsMutating } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useMemo, type FC } from "react";

type Props = {
    active: boolean;
    projectId: string;
};

export const StyleStepCard: FC<Props> = ({ projectId, active }) => {
    const href = getPath("PROJECT_VIDEO_EDIT_STYLE", { projectId });

    const pathname = usePathname();
    const router = useRouter();

    const isMutating = useIsMutating({ mutationKey: ["update", projectId] });

    const isScript2EntitiesMutating = useIsMutating({
        mutationKey: [TaskTypeEnum.SCRIPT2ENTITIES_FLOW, projectId],
    });

    const { data: project, isLoading: isProjectLoading } = useProjectGetById({
        id: projectId,
    });

    const { isCompleted } = useTaskStatus(
        TaskTypeEnum.TXT2SCRIPT_FLOW,
        project?.tasks,
    );

    const isLoading = useMemo(() => {
        return (
            isProjectLoading ||
            (!!isMutating && pathname.endsWith("/edit/style"))
        );
    }, [isProjectLoading, isMutating, pathname]);

    const disabled = useMemo(() => {
        return !isCompleted;
    }, [isCompleted]);

    const { mutateAsync: script2entities } = useProjectVideoScript2Entities([
        TaskTypeEnum.SCRIPT2ENTITIES_FLOW,
        projectId,
    ]);

    const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!project) return;

        e.preventDefault();

        try {
            await script2entities({
                id: project.id,
            });

            const nextPath = getPath("PROJECT_VIDEO_EDIT_ENTITIES", {
                projectId,
            });

            router.push(nextPath);
        } catch (error: unknown) {
            console.error("Failed to generate entities:", error);
        }
    };

    return (
        <ProjectStepCard
            title="STYLE"
            active={active}
            loading={isLoading}
            isVisible={isCompleted}
            disabled={disabled}
            hasTransition={!project?.style_name}
            id="step2"
            route={href}
        >
            <ProjectNextLayoutButton
                onClick={handleNext}
                title={project?.style_name ? "NEXT" : "SKIP"}
                isVisible={isCompleted && active && !project?.config?.auto_mode}
                loading={!!isScript2EntitiesMutating}
            >
                <ProjectStepCard.Item
                    title={project?.style?.title ?? "Default"}
                    thumbnail={project?.style?.thumbnail ?? ""}
                    // href={href}
                />
            </ProjectNextLayoutButton>
        </ProjectStepCard>
    );
};
