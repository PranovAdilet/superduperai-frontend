"use client";

import { BackButton, SuspenseQuery } from "@/shared/ui";
import { Flex, Separator } from "@radix-ui/themes";
import { useMemo, type FC } from "react";
import { FileImageGenerate } from "@/widgets/file";
import { DataTypeEnum, FileTypeEnum } from "@/shared/api";
import { useFileById, useFileList } from "@/entities/file";
import { useProjectData, useProjectGetById } from "@/entities/project";
import { getPath } from "@/shared/config/routes";
import { useRouter } from "@/i18n/navigation";

type Props = {
    projectId: string;
};

const ProjectMediaNewPage: FC<Props> = ({ projectId }) => {
    const { push } = useRouter();

    const backRoute = getPath("PROJECT_IMAGE_DETAIL", { projectId });

    const {
        data: project,
        isLoading,
        isError,
        refetch,
    } = useProjectGetById({
        id: projectId,
    });

    const imageData = useProjectData(project, DataTypeEnum.IMAGE);

    const sourceId = useMemo(() => {
        if (!project) return;
        if (!imageData) return;
        if (!imageData.value) return;
        return imageData.value.file_id;
    }, [imageData]);

    const {
        data: source,
        isLoading: isLoadingSource,
        isError: isErrorSource,
    } = useFileById(
        {
            id: sourceId ?? "",
        },
        {
            enabled: !!sourceId,
        },
    );

    const {
        data: files,
        isLoading: isLoadingFiles,
        isError: isErrorFiles,
    } = useFileList(
        { projectId },
        {
            enabled:
                source?.image_generation?.generation_config_name !==
                "comfyui/flux",
        },
    );

    const handleComplete = () => {
        push(backRoute);
    };

    const notInpaintingFile = useMemo(() => {
        return files?.items.find(
            (file) =>
                file.image_generation?.generation_config_name &&
                file.image_generation.generation_config_name !==
                    "comfyui/flux/inpainting",
        );
    }, [files]);

    const initialValue = useMemo(() => {
        if (!source) return;
        if (source.type !== FileTypeEnum.IMAGE) return;
        if (!source.image_generation) return;
        if (source.image_generation.generation_config_name !== "comfyui/flux")
            return notInpaintingFile?.image_generation ?? undefined;
        return source.image_generation;
    }, [source, notInpaintingFile]);

    return (
        <Flex
            direction="column"
            flexGrow="1"
            gapY="5"
            p="6"
        >
            <Flex
                gap="2"
                direction="column"
            >
                <BackButton route={backRoute} />
                <Separator size="4" />
            </Flex>

            <SuspenseQuery
                isError={isError || isErrorSource || isErrorFiles}
                isLoading={isLoading || isLoadingSource || isLoadingFiles}
                refetch={refetch}
            >
                <FileImageGenerate
                    projectId={projectId}
                    initialValue={initialValue}
                    onComplete={handleComplete}
                    enableResolutionChange
                />
            </SuspenseQuery>
        </Flex>
    );
};

export default ProjectMediaNewPage;
