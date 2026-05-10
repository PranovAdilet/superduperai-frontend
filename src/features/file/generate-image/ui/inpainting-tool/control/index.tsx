"use client";

import type { IFileRead } from "@/shared/api";
import { ReferenceTypeEnum } from "@/shared/api";
import { Card, Flex } from "@radix-ui/themes";
import { useFileGenerateImage } from "../../../query";
import { useFileUpload } from "@/features/file/upload";
import { useInpaintingToolContext } from "../provider";
import { InpaintingTools } from "./inpainting-tools";
import { InpaintingForm } from "./inpainting-form";
import { useModal } from "@/shared/store";
import { useSceneGetById } from "@/entities/scene";
import { useSceneUpdate } from "@/features/scene";
import { useEffect, useState } from "react";
import { useProjectGetById } from "@/entities/project";

type ControlProps = {
    active: string;
    setActive: (value: string) => void;
};

type Props = {
    file: IFileRead;
    projectId?: string;
    sceneId?: string;
    entityId?: string;
    onGenerating?: () => void;
    isActive?: boolean;
};

export const getControl =
    ({ file, projectId, sceneId, entityId, onGenerating, isActive }: Props) =>
    ({ active, setActive }: ControlProps) => {
        const { canvas } = useInpaintingToolContext();

        useEffect(() => {
            if (!isActive) return;
            setActive("inpainting");
        }, []);

        const { mutate: generateImage, isPending: isGenerating } =
            useFileGenerateImage();

        const { close } = useModal();

        const [seed, setSeed] = useState<string>(
            String(Math.floor(Math.random() * 1e9) + 1),
        );

        const { data: scene } = useSceneGetById(
            {
                id: sceneId ?? "0",
            },
            { enabled: !!sceneId },
        );

        const { mutate: updateScene } = useSceneUpdate();

        const { mutateAsync: uploadFile, isPending: isUploading } =
            useFileUpload();

        const { data: project } = useProjectGetById(
            { id: projectId ?? "" },
            { enabled: !!projectId },
        );

        useEffect(() => {
            if (!project) return;
            setSeed(project.config?.seed as string);
        }, [project]);

        const handleInpainting = async (
            prompt: string,
            mask: File,
            generationConfig: string,
        ) => {
            const maskFile = await uploadFile({ formData: { payload: mask } });

            generateImage(
                {
                    requestBody: {
                        project_id: projectId,
                        scene_id: sceneId,
                        entity_id: entityId,
                        config: {
                            ...file.image_generation,
                            generation_config_name: generationConfig,
                            shot_size: null,
                            style_name: null,
                            prompt,
                            negative_prompt: "",
                            seed: Number(seed),
                            references: [
                                {
                                    type: ReferenceTypeEnum.MASK,
                                    reference_id: maskFile.id,
                                },
                                {
                                    type: ReferenceTypeEnum.SOURCE,
                                    reference_id: file.id,
                                },
                            ],
                        },
                    },
                },
                {
                    onSuccess: (data) => {
                        setActive("");
                        close();
                        onGenerating?.();
                        if (!scene) return;
                        updateScene({
                            id: sceneId ?? "",
                            requestBody: { ...scene, file_id: data[0].id },
                        });
                    },
                },
            );
        };

        return (
            <Flex
                style={{
                    height: active === "inpainting" ? "100%" : "50px",
                    transition: "height 0.25s ease-in-out",
                }}
                overflow="hidden"
            >
                <Card className="size-full">
                    <Flex
                        direction="column"
                        justify="between"
                        gap="5"
                        align="start"
                        height="100%"
                        width="100%"
                    >
                        <InpaintingTools
                            active={active === "inpainting"}
                            onActiveChange={setActive}
                            canvas={canvas}
                            isCombined={isActive}
                        />
                        {active === "inpainting" && (
                            <InpaintingForm
                                canvas={canvas}
                                onComplete={handleInpainting}
                                loading={isGenerating || isUploading}
                                seed={seed}
                                onSeedChange={setSeed}
                            />
                        )}
                    </Flex>
                </Card>
            </Flex>
        );
    };
