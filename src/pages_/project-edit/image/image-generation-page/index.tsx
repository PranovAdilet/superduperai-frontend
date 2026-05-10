"use client";

import { Box, Button, Flex, Separator, Text } from "@radix-ui/themes";
import { Image, Select, TextArea, TextField } from "@/shared/ui";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import type {
    IEntityRead,
    IFileRead,
    IImageGenerationReferenceCreate,
    QualityTypeEnum,
} from "@/shared/api";
import { DataTypeEnum, IProjectMediaCreate, ShotSizeEnum } from "@/shared/api";

import { FileUploader } from "@/features/file";
import { UploadButton, FileImageGenerationForm } from "@/entities/file";
import { useProjectImageCreate } from "@/features/project-image";
import { useProjectData, useProjectGetById } from "@/entities/project";
import { X } from "lucide-react";
import { useStyleList } from "@/entities/style";
import { StylesList } from "@/widgets/style";
import { useAspectRatio } from "@/shared/hooks";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { EntitySelectDialog, EntitySelectLayout } from "@/entities/entity";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config/routes";

type Props = {
    projectId?: string;
};

type ImageLocalStorageConfig = {
    prompt: string;
    shot_size: string | null;
    style_name: string | null;
    seed: string;
    aspecRatio: string;
    qualityType: QualityTypeEnum;
};

const IMAGE_LOCALSTORAGE_KEY = "image";

const ImageGenerationPage: FC<Props> = ({ projectId }) => {
    const { push } = useRouter();

    const { data: project } = useProjectGetById(
        {
            id: projectId!,
        },
        {
            enabled: !!projectId,
        },
    );

    const imageData = useProjectData(project, DataTypeEnum.IMAGE);

    const { mutateAsync: imageProject, isPending: isStartPending } =
        useProjectImageCreate();

    // const [styleReference, setStyleReference] =
    //     useState<IImageGenerationReferenceRead | null>(null);

    const [imagePrompt, setImagePrompt] = useState("Man on horse");

    const [imageShotSize, setImageShotSize] = useState<ShotSizeEnum | null>(
        null,
    );
    const [proRequired, setProRequired] = useState<boolean>(false);

    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

    const { data: style } = useStyleList(
        { searchText: selectedStyle },
        { enabled: !!selectedStyle },
    );

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setImagePrompt(e.target.value);
    };

    const handleShotSizeChange = (value: string | null) => {
        setImageShotSize(value ? (value as ShotSizeEnum) : null);
    };

    const handleGenerate = async () => {
        const references: IImageGenerationReferenceCreate[] = [];

        // if (styleReference?.reference_id) {
        //     references.push({
        //         reference_id: styleReference.reference_id,
        //         type: styleReference.type,
        //     });
        // }

        if (imageData) {
            return;
        }

        const config = {
            prompt: imagePrompt,
            shot_size: imageShotSize,
            style_name: selectedStyle,
            seed,
            aspecRatio,
            qualityType,
        };

        const ids = entities.map((e) => e.id);
        const project = await imageProject(
            {
                template_name: null,
                type: IProjectMediaCreate.type.MEDIA,
                config: {
                    ...config,
                    generation_config_name: generationConfig,
                    batch_size: 3,
                    references,
                    height: aspectRatioHeight,
                    width: aspectRatioWidth,
                    entity_ids: ids,
                },
                style_name: selectedStyle,
            },
            {
                onSuccess: () => {
                    localStorage.setItem(
                        IMAGE_LOCALSTORAGE_KEY,
                        JSON.stringify(config),
                    );
                },
            },
        );
        push(getPath("PROJECT_IMAGE_DETAIL", { projectId: project.id }));
    };

    const handleUpload = async (file: IFileRead) => {
        if (imageData) {
            return;
        }

        const project = await imageProject({
            template_name: null,
            type: IProjectMediaCreate.type.MEDIA,
            config: {},
            file_id: file.id,
        });
        push(getPath("PROJECT_IMAGE_DETAIL", { projectId: project.id }));
    };

    const shotSizeOptions = [
        { label: "Any", value: null },
        ...Object.values(ShotSizeEnum).map((value) => ({
            label: value as string,
            value: value as string,
        })),
    ];

    const {
        aspecRatio,
        aspectRatioHeight,
        aspectRatioWidth,
        qualityType,

        handleAspectRatioHeightChange,
        handleAspectRatioWidthChange,
        handleQualityChange,
        handleRatioChange,
        setAspectRatio,
        setQuality,
    } = useAspectRatio();

    const [seed, setSeed] = useState<string>(
        String(Math.floor(Math.random() * 1_000_000_000_000) + 1),
    );

    const [generationConfig, setGenerationConfig] = useState<string | null>(
        "comfyui/flux",
    );

    const [isEditingStyle, setIsEditingStyle] = useState(false);

    useEffect(() => {
        const handlePopState = () => {
            setIsEditingStyle(false);
        };

        if (isEditingStyle) {
            window.history.pushState({ isEditing: true }, "");
        }

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isEditingStyle]);

    useEffect(() => {
        const item = localStorage.getItem(IMAGE_LOCALSTORAGE_KEY);
        const config: ImageLocalStorageConfig | undefined =
            item && JSON.parse(item);
        if (!config) return;

        const { prompt, shot_size, style_name, seed, aspecRatio, qualityType } =
            config;

        setImagePrompt(prompt);
        handleShotSizeChange(shot_size);
        setSelectedStyle(style_name);
        setSeed(seed);
        setAspectRatio(aspecRatio);
        setQuality(qualityType);
    }, []);

    const handleSelectStyle = (value: string | null) => {
        setSelectedStyle(value);
        setIsEditingStyle(false);
    };
    const [entities, setEntities] = useState<IEntityRead[]>([]);

    const handleEntitySelect = (selectedEntities: IEntityRead[]) => {
        let prompts = "";
        selectedEntities.forEach((selectedEntity) => {
            if (imagePrompt.includes(selectedEntity.image_prompt)) {
                return;
            } else {
                prompts += `\n ${selectedEntity.image_prompt}`;
            }
        });
        setImagePrompt(imagePrompt + prompts);
    };

    return (
        <Flex
            flexGrow="1"
            gap="5"
            p="6"
            direction="column"
            className={styles.container}
        >
            {isEditingStyle ? (
                <StylesList
                    style={selectedStyle}
                    onStyleChange={handleSelectStyle}
                    dense
                />
            ) : (
                <>
                    <EntitySelectDialog onSelect={handleEntitySelect} />
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
                            <EntitySelectLayout
                                entities={entities}
                                setEntities={setEntities}
                                showEntities={false}
                            />
                            <TextArea
                                full
                                label="Image Prompt"
                                value={imagePrompt}
                                onChange={handleChange}
                                disabled={isStartPending}
                                className="min-h-36 grow rounded-3xl"
                                autoFocus
                                onFocus={(e) => {
                                    const element = e.target;
                                    element.setSelectionRange(
                                        element.value.length,
                                        element.value.length,
                                    );
                                }}
                            />
                            <Box
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
                            </Box>
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
                                    label={{ size: "2" }}
                                />
                                <Flex
                                    gap="4"
                                    align="center"
                                    className={styles.aspectRatioContainer}
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
                                <FileImageGenerationForm.GenerationConfig
                                    value={generationConfig}
                                    onChange={setGenerationConfig}
                                />
                            </FileImageGenerationForm.Root>

                            <Select
                                label="Shot Size"
                                className="grow"
                                value={imageShotSize}
                                options={shotSizeOptions}
                                onChange={handleShotSizeChange}
                            />
                            <Flex
                                gap="3"
                                align="center"
                            >
                                <TextField
                                    full
                                    type="number"
                                    value={aspectRatioWidth}
                                    onChange={handleAspectRatioWidthChange}
                                    max="2500"
                                />
                                <Text>
                                    <X size="17px" />
                                </Text>
                                <TextField
                                    full
                                    type="number"
                                    value={aspectRatioHeight}
                                    onChange={handleAspectRatioHeightChange}
                                    max="2500"
                                />
                            </Flex>

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
                                        }}
                                    >
                                        {selectedStyle ? (
                                            <Image
                                                src={style?.items[0]?.thumbnail}
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
                                        {style?.items[0]?.title ??
                                            "none selected"}
                                    </Text>
                                </Flex>
                                <Flex
                                    gap="2"
                                    direction="column"
                                >
                                    <Button
                                        loading={isStartPending}
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

                                    <Flex
                                        align="center"
                                        gap="4"
                                    >
                                        <Separator size="4" />
                                        <Text>OR</Text>
                                        <Separator size="4" />
                                    </Flex>

                                    <FileUploader onUpload={handleUpload}>
                                        {(handleClick, isPending) => (
                                            <UploadButton
                                                onClick={handleClick}
                                                loading={isPending}
                                            >
                                                Upload Own Image
                                            </UploadButton>
                                        )}
                                    </FileUploader>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export default ImageGenerationPage;
