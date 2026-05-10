"use client";
import { ProjectStepCard, useProjectGetById } from "@/entities/project";
import { useTaskStatus } from "@/entities/task";
import { TaskTypeEnum } from "@/shared/api";
import { getPath } from "@/shared/config";
import { Text } from "@radix-ui/themes";
import type { FC } from "react";

type Props = {
    projectId: string;
    active: boolean;
};

export const PreviewStepCard: FC<Props> = ({ projectId, active }) => {
    const href = getPath("PREVIEW_PROJECT", { projectId });

    const { data: project } = useProjectGetById({ id: projectId });

    const { isCompleted } = useTaskStatus(
        TaskTypeEnum.SCRIPT2STORYBOARD_FLOW,
        project?.tasks,
    );

    return (
        <ProjectStepCard
            title="PREVIEW"
            active={active}
            disabled={!isCompleted}
            id="step6"
            actionBtn={<Text color={isCompleted ? "lime" : "gray"}>OPEN</Text>}
            route={href}
        ></ProjectStepCard>
    );
};
