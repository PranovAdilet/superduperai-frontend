"use client";

import { Button, Flex, Separator, Text } from "@radix-ui/themes";
import { Image, Select, TextArea, TextField } from "@/shared/ui";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import type {
    IEntityRead,
    IFileRead,
    // IFileRead,
    IImageGenerationRead,
    IImageGenerationReferenceCreate,
    IImageGenerationReferenceRead,
} from "@/shared/api";
import { ShotSizeEnum, ReferenceTypeEnum } from "@/shared/api";

import { FileUploader } from "@/features/file";
import { UploadButton, FileImageGenerationForm } from "@/entities/file";
import { useFileGenerateImage } from "@/features/file/generate-image";
import { useStyleList } from "@/entities/style";
import { X } from "lucide-react";
import { StylesList } from "@/widgets/style";
import { useProjectGetById } from "@/entities/project";
import { useAspectRatio } from "@/shared/hooks";
import {
    EntitySelectDialog,
    EntitySelectLayout,
    useEntityListByIds,
} from "@/entities/entity";
import { EntityUpdateDialog } from "@/features/entity";
import { useModal } from "@/shared/store";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config";
import styles from "./styles.module.scss";
import clsx from "clsx";

type Props = {
    projectId?: string;
    entityId?: string;
    sceneId?: string;
    hideUpload?: boolean;
    initialValue?: IImageGenerationRead;
    onComplete?: (file?: IFileRead) => void;
    enableResolutionChange?: boolean;
    onEditingStyle?: (value: boolean) => void;
};

export const FileImageGenerate: FC<Props> = ({
    projectId,
    entityId,
    sceneId,
    hideUpload,
    initialValue,
    onComplete,
    onEditingStyle,
    enableResolutionChange,
}) => {
    const { push } = useRouter();

    const { open } = useModal();

    const { mutateAsync: generateImage, isPending: isGenerating } =
        useFileGenerateImage();

    const [styleReference, setStyleReference] =
        useState<IImageGenerationReferenceRead | null>(null);

    const [faceReference, setFaceReference] =
        useState<IImageGenerationReferenceRead | null>(null);

    const [imagePrompt, setImagePrompt] = useState(initialValue?.prompt ?? "");

    const [imageShotSize, setImageShotSize] = useState<ShotSizeEnum | null>(
        initialValue?.shot_size ?? null,
    );

    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

    const { data: style } = useStyleList(
        { searchText: selectedStyle },
        { enabled: !!selectedStyle },
    );

    const { data: project } = useProjectGetById(
        { id: projectId! },
        { enabled: !!projectId },
    );

    const { data: initialEntities } = useEntityListByIds(
        { requestBody: initialValue?.entity_ids ?? [] },
        { enabled: !!initialValue?.entity_ids.length },
    );

    useEffect(() => {
        if (!project) return;
        setSeed(project.config?.seed as string);
    }, [project?.config?.seed]);

    useEffect(() => {
        const references = initialValue?.references;

        if (references) {
            const face = references.find(
                (ref) => ref.type === ReferenceTypeEnum.FACE,
            );

            const style = references.find(
                (ref) => ref.type === ReferenceTypeEnum.STYLE,
            );

            if (face) {
                setFaceReference(face);
            }
            if (style) {
                setStyleReference(style);
            }
        }
    }, [initialValue?.references]);

    useEffect(() => {
        setSelectedStyle(initialValue?.style_name ?? null);
    }, [initialValue?.style_name]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setImagePrompt(e.target.value);
    };

    const handleShotSizeChange = (value: string | null) => {
        setImageShotSize(value ? (value as ShotSizeEnum) : null);
    };

    const handleGenerate = async () => {
        const references: IImageGenerationReferenceCreate[] = [];

        if (styleReference?.reference_id) {
            references.push({
                reference_id: styleReference.reference_id,
                type: styleReference.type,
            });
        }

        if (faceReference?.reference_id) {
            references.push({
                reference_id: faceReference.reference_id,
                type: faceReference.type,
            });
        }

        const ids = entities.map((e) => e.id);

        try {
            const files = await generateImage({
                requestBody: {
                    project_id: projectId,
                    entity_id: entityId,
                    scene_id: sceneId,
                    config: {
                        ...initialValue,
                        prompt: imagePrompt,
                        shot_size: imageShotSize,
                        style_name: selectedStyle,
                        batch_size: 3,
                        references,
                        seed: Number(seed),
                        entity_ids: ids,
                        generation_config_name:
                            generationConfig ?? "comfyui/flux",
                    },
                },
            });
            onComplete?.(files[0]);
        } catch (error) {
            console.error("Failed to generate image:", error);
        }
    };

    const handleUpload = (file: IFileRead) => {
        onComplete?.(file);
    };

    const shotSizeOptions = [
        { label: "Any", value: null },
        ...Object.values(ShotSizeEnum).map((value) => ({
            label: value as string,
            value: value as string,
        })),
    ];

    const [seed, setSeed] = useState<string>(
        String(Math.floor(Math.random() * 1_000_000_000_000) + 1),
    );

    const [isEditingStyle, setIsEditingStyle] = useState(false);
    const [entities, setEntities] = useState<IEntityRead[]>([]);
    const [entity, setEntity] = useState<IEntityRead>();

    const [generationConfig, setGenerationConfig] = useState<string | null>(
        "comfyui/flux",
    );

    const [proRequired, setProRequired] = useState<boolean>(false);

    useEffect(() => {
        if (!initialEntities) return;
        setEntities(initialEntities);
        mergeEntitiesToPrompt(initialEntities);
    }, [initialEntities]);

    useEffect(() => {
        const handlePopState = () => {
            setIsEditingStyle(false);
            onEditingStyle?.(false);
        };

        if (isEditingStyle) {
            window.history.pushState({ isEditing: true }, "");
        }

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isEditingStyle]);

    const handleSelectStyle = (value: string | null) => {
        setSelectedStyle(value);
        setIsEditingStyle(false);
        onEditingStyle?.(false);
    };

    const {
        aspecRatio,
        aspectRatioHeight,
        aspectRatioWidth,
        qualityType,

        handleAspectRatioHeightChange,
        handleAspectRatioWidthChange,
        handleQualityChange,
        handleRatioChange,
    } = useAspectRatio();

    const redirectToCreate = () => {
        push(getPath("MY_ENTITIES"));
    };

    const handleSelectEntities = (selectedEntities: IEntityRead[]) => {
        const newEntities: IEntityRead[] = [];
        selectedEntities.forEach((selectedEntity) => {
            if (entities.find((e) => e.id === selectedEntity.id)) {
                return;
            } else {
                newEntities.push(selectedEntity);
            }
        });
        setEntities([...entities, ...newEntities]);
        mergeEntitiesToPrompt(selectedEntities);
    };

    const handleOpenEntity = (e: IEntityRead) => {
        setEntity(e);
        open("entityUpdateDialog");
    };

    const handleUpdateEntities = (responseEntity?: IEntityRead) => {
        const updatedEntities = entities.map((e) => {
            if (responseEntity?.id === e.id) {
                setEntity(responseEntity);
                mergeEntitiesToPrompt([responseEntity]);
                return responseEntity;
            }
            return e;
        });

        setEntities(updatedEntities);
        mergeEntitiesToPrompt(updatedEntities);
    };

    const mergeEntitiesToPrompt = (dataEntities: IEntityRead[]) => {
        let prompts = "";
        dataEntities.forEach((e) => {
            if (imagePrompt.includes(e.image_prompt)) {
                return;
            } else {
                prompts += `\n ${e.image_prompt}`;
            }
        });
        setImagePrompt(imagePrompt + prompts);
    };

    return (
        <Flex
            flexGrow="1"
            gap="5"
            direction="column"
            pb="4"
            className={styles.container}
        >
            {isEditingStyle ? (
                <StylesList
                    style={selectedStyle}
                    onStyleChange={handleSelectStyle}
                    projectId={projectId ?? ""}
                    dense
                />
            ) : (
                <>
                    <Flex
                        gap="5"
                        className={styles.row}
                    >
                        <Flex
                            gap="5"
                            style={{ flex: 65 }}
                            direction="column"
                            position="relative"
                        >
                            <TextArea
                                full
                                label="Image Prompt"
                                value={imagePrompt}
                                onChange={handleChange}
                                disabled={isGenerating}
                                className="grow rounded-3xl"
                                style={{ paddingBottom: "70px" }}
                            />
                            <EntityUpdateDialog
                                entity={entity}
                                onEntityUpdate={handleUpdateEntities}
                            />

                            <EntitySelectLayout
                                entities={entities}
                                setEntities={setEntities}
                                setEntity={handleOpenEntity}
                            />
                            {/* <Box
                                position="absolute"
                                bottom="4"
                                right="5"
                            >
                                <Button
                                    variant="ghost"
                                    color="gray"
                                >
                                    ECHANCE PROMPT
                                </Button>
                            </Box> */}
                        </Flex>

                        <Flex
                            direction="column"
                            style={{ flex: 35 }}
                            gap="4"
                            pt="5"
                        >
                            <FileImageGenerationForm.Root
                                onProRequired={setProRequired}
                                dense
                            >
                                <FileImageGenerationForm.Seed
                                    value={seed}
                                    onChange={setSeed}
                                    label={{ size: "2", position: "left" }}
                                />
                                <FileImageGenerationForm.GenerationConfig
                                    value={generationConfig}
                                    onChange={setGenerationConfig}
                                />
                            </FileImageGenerationForm.Root>

                            {enableResolutionChange && (
                                <>
                                    <FileImageGenerationForm.Root dense>
                                        <Flex
                                            gap="4"
                                            align="center"
                                            className={
                                                styles.aspectRatioContainer
                                            }
                                        >
                                            <FileImageGenerationForm.AspectRatio
                                                value={aspecRatio}
                                                onChange={handleRatioChange}
                                            />
                                            <FileImageGenerationForm.Quality
                                                value={qualityType}
                                                onChange={handleQualityChange}
                                            />
                                        </Flex>
                                    </FileImageGenerationForm.Root>

                                    <Flex
                                        gap="3"
                                        align="center"
                                    >
                                        <TextField
                                            full
                                            type="number"
                                            value={aspectRatioWidth}
                                            onChange={
                                                handleAspectRatioWidthChange
                                            }
                                            max="2500"
                                        />
                                        <Text>
                                            <X size="17px" />
                                        </Text>
                                        <TextField
                                            full
                                            type="number"
                                            value={aspectRatioHeight}
                                            onChange={
                                                handleAspectRatioHeightChange
                                            }
                                            max="2500"
                                        />
                                    </Flex>
                                </>
                            )}
                            <Select
                                label="Shot Size"
                                className="grow"
                                value={imageShotSize}
                                options={shotSizeOptions}
                                onChange={handleShotSizeChange}
                            />

                            <Flex
                                direction="column"
                                gap="3"
                            >
                                <Text>SELECT STYLE</Text>
                                <Flex
                                    direction="column"
                                    gap="3"
                                >
                                    <Flex
                                        className={clsx(
                                            "cursor-default rounded-lg  border border-gray-600",
                                            styles.stylePreview,
                                        )}
                                        width="150px"
                                        height="150px"
                                        justify="center"
                                        align="center"
                                        onClick={() => {
                                            setIsEditingStyle(true);
                                            onEditingStyle?.(true);
                                        }}
                                    >
                                        {selectedStyle ? (
                                            <Image
                                                src={style?.items[0].thumbnail}
                                                className="rounded-lg"
                                            />
                                        ) : (
                                            <Text
                                                color="gray"
                                                size="7"
                                            >
                                                +
                                            </Text>
                                        )}
                                    </Flex>
                                    <Text>
                                        {style?.items[0].title ??
                                            "none selected"}
                                    </Text>
                                </Flex>
                                <Flex
                                    gap="2"
                                    direction="column"
                                >
                                    <Button
                                        loading={isGenerating}
                                        variant="classic"
                                        size="2"
                                        className="rounded-2xl p-5 py-6"
                                        onClick={handleGenerate}
                                        disabled={proRequired}
                                    >
                                        <Text
                                            weight="medium"
                                            size="3"
                                        >
                                            Generate Image
                                        </Text>
                                    </Button>
                                    {!hideUpload && (
                                        <>
                                            <Flex
                                                align="center"
                                                gap="4"
                                            >
                                                <Separator size="4" />
                                                <Text>OR</Text>
                                                <Separator size="4" />
                                            </Flex>

                                            <FileUploader
                                                onUpload={handleUpload}
                                                sceneId={sceneId}
                                                projectId={projectId}
                                                entityId={entityId}
                                            >
                                                {(handleClick, isPending) => (
                                                    <UploadButton
                                                        onClick={handleClick}
                                                        loading={isPending}
                                                    >
                                                        Upload Own Image
                                                    </UploadButton>
                                                )}
                                            </FileUploader>
                                        </>
                                    )}
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </>
            )}
            <EntitySelectDialog
                onSelect={handleSelectEntities}
                onRedirectToCreate={redirectToCreate}
            />
        </Flex>
    );
};
