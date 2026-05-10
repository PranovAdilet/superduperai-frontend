"use client";

import { SuspenseQuery } from "@/shared/ui";
import { Flex, Separator, Text } from "@radix-ui/themes";
import { useMemo, useState, type FC } from "react";
import { useSceneGetById } from "@/entities/scene";
import { FileImageGenerate } from "@/widgets/file";
import type { IFileRead } from "@/shared/api";
import { FileTypeEnum, ReferenceTypeEnum } from "@/shared/api";
import { useFileById, useFileList } from "@/entities/file";
import { ArrowLeft } from "lucide-react";
import { useSceneUpdate } from "@/features/scene";
import { getPath } from "@/shared/config/routes";
import { useRouter } from "@/i18n/navigation";

type Props = { sceneId: string; projectId: string };

const StoryboardSceneMediaNewPage: FC<Props> = ({ projectId, sceneId }) => {
    const { push, back } = useRouter();

    const backRoute = getPath("PROJECT_VIDEO_STORYBOARD_SCENE", {
        projectId,
        sceneId,
    });

    const {
        data: scene,
        isLoading: isLoadingScene,
        isError: isErrorScene,
        refetch,
    } = useSceneGetById({ id: sceneId });

    const { mutate: updateScene } = useSceneUpdate();

    const [isEditingStyle, setIsEditingStyle] = useState(false);

    const sourceId = useMemo(() => {
        if (!scene) return undefined;
        if (!scene.file) return undefined;
        if (!scene.file.video_generation) return undefined;
        const sourceReference = scene.file.video_generation.references.find(
            (ref) => ref.type === ReferenceTypeEnum.SOURCE,
        );
        if (!sourceReference) return undefined;
        return sourceReference.reference_id;
    }, [scene]);

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
    } = useFileList({ sceneId, projectId });

    const handleComplete = (file?: IFileRead) => {
        if (file && scene) {
            updateScene({
                id: sceneId,
                requestBody: { ...scene, file_id: file.id },
            });
        }
        push(backRoute);
    };

    const handleBack = () => {
        if (isEditingStyle) {
            back();
        } else {
            push(backRoute);
        }
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
        if (!scene) return undefined;
        if (!scene.file) return undefined;

        if (source && source.type === FileTypeEnum.IMAGE)
            return source.image_generation ?? undefined;

        if (
            scene.file.image_generation?.generation_config_name ===
            "comfyui/flux/inpainting"
        )
            return notInpaintingFile?.image_generation ?? undefined;

        return scene.file.image_generation ?? undefined;
    }, [scene, source, notInpaintingFile]);

    const isLoading = isLoadingScene || isLoadingSource || isLoadingFiles;

    const isError = isErrorScene || isErrorSource || isErrorFiles;

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
                {/* <BackButton route={backRoute} /> */}
                <button
                    onClick={handleBack}
                    className="flex gap-x-2 text-gray-400"
                    color="gray"
                >
                    <ArrowLeft />
                    <Text>Back</Text>
                </button>
                <Separator size="4" />
            </Flex>

            <SuspenseQuery
                isError={isError}
                isLoading={isLoading}
                refetch={refetch}
            >
                <FileImageGenerate
                    projectId={projectId}
                    sceneId={sceneId}
                    initialValue={initialValue}
                    onComplete={handleComplete}
                    onEditingStyle={setIsEditingStyle}
                />
            </SuspenseQuery>
        </Flex>
    );
};

export default StoryboardSceneMediaNewPage;
