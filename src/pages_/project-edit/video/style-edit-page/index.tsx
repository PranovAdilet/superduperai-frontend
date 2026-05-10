"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { TaskTypeEnum } from "@/shared/api";
import {
    ProjectNextBtn,
    ProjectStep,
    useProjectGetById,
} from "@/entities/project";
import { useProjectUpdate } from "@/features/project";
import { useProjectVideoScript2Entities } from "@/features/project-video";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config/routes";
import { StylesList } from "@/widgets/style";
import { useIsMutating } from "@tanstack/react-query";

type Props = {
    projectId: string;
};

enum ImageModelTypeEnum {
    FLUX = "flux",
    SDXL = "sdxl",
}

const StyleEditPage: FC<Props> = ({ projectId }) => {
    const { push, prefetch } = useRouter();

    const { data: project } = useProjectGetById({
        id: projectId,
    });

    const [selectedStyle, setSelectedStyle] = useState<string | null>(
        project?.style_name ?? null,
    );

    const [modelType, setModelType] = useState<ImageModelTypeEnum>(
        (project?.config?.image_model_type ??
            ImageModelTypeEnum.FLUX) as ImageModelTypeEnum,
    );

    const { mutate: updateProject } = useProjectUpdate(["update", projectId]);

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!project) {
            return;
        }
        if (
            project.style_name === selectedStyle &&
            project.config?.image_model_type === modelType
        ) {
            return;
        }
        if (timer) {
            clearTimeout(timer);
        }
        setTimer(
            setTimeout(() => {
                updateProject({
                    ...project,
                    style_name: selectedStyle,
                    config: {
                        ...project.config,
                        image_model_type: modelType,
                    },
                });
            }, 800),
        );
    }, [selectedStyle, modelType]);

    const nextRoutePath = getPath("PROJECT_VIDEO_EDIT_ENTITIES", { projectId });

    useEffect(() => {
        prefetch(nextRoutePath);
    }, [prefetch, projectId, nextRoutePath]);

    useEffect(() => {
        if (!project) {
            return;
        }
        if (selectedStyle === project.style_name) {
            return;
        }
        setSelectedStyle(project.style_name);
        if (!project.config || modelType === project.config.image_model_type) {
            return;
        }
        const newModelType: ImageModelTypeEnum =
            (project.config.image_model_type as
                | ImageModelTypeEnum
                | undefined
                | null) ?? ImageModelTypeEnum.SDXL;
        setModelType(newModelType);
    }, [project]);

    const {
        mutateAsync: script2entities,
        isPending,
        isSuccess,
    } = useProjectVideoScript2Entities([
        TaskTypeEnum.SCRIPT2ENTITIES_FLOW,
        projectId,
    ]);

    const isScript2EntitiesMutating = useIsMutating({
        mutationKey: [TaskTypeEnum.SCRIPT2ENTITIES_FLOW, projectId],
    });

    const handleNext = async () => {
        if (!project) return;

        try {
            await script2entities({
                id: project.id,
            });

            push(nextRoutePath);
        } catch (error: unknown) {
            console.error("Failed to generate entities:", error);
        }
    };

    return (
        <ProjectStep>
            <StylesList
                style={selectedStyle}
                projectId={projectId}
                onStyleChange={(value) => {
                    setSelectedStyle(value);
                }}
            />
            <ProjectStep.Footer>
                <ProjectNextBtn
                    label={project?.style_name ? "NEXT" : "SKIP"}
                    loading={
                        isPending || isSuccess || !!isScript2EntitiesMutating
                    }
                    onClick={handleNext}
                />
            </ProjectStep.Footer>
        </ProjectStep>
    );
};

export default StyleEditPage;
