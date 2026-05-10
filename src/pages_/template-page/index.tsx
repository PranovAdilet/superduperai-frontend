"use client";

import { TemplateExamplePrompt, useTemplateList } from "@/entities/template";
import type { ChangeEvent, FC } from "react";
import { useMemo, useState } from "react";
import { Button, Card, Flex, Spinner, Text, TextArea } from "@radix-ui/themes";
import { SuspenseQuery } from "@/shared/ui";
import { ArrowRight } from "lucide-react";
import { useProjectVideoCreate } from "@/features/project-video";
import { QualityTypeEnum, type IEntityRead } from "@/shared/api";
import { useWindowSize } from "react-use";
import { EntitySelectDialog, EntitySelectLayout } from "@/entities/entity";
import { useAspectRatio } from "@/shared/hooks";
import { useUserMe } from "@/entities/user";
import { ProjectAutoModeSwitcher } from "@/entities/project";
import { getPath } from "@/shared/config/routes";
import { useRouter } from "@/i18n/navigation";
import { FileImageGenerationForm } from "@/entities/file";

type Props = {
    templateName: string;
};

const TemplatePage: FC<Props> = ({ templateName }) => {
    const [promptCompleted, setPromptCompleted] = useState(false);

    const { data, isLoading, isError, refetch } = useTemplateList();

    const { mutate, isPending, isSuccess } = useProjectVideoCreate();

    const { data: user } = useUserMe();

    const [prompt, setPrompt] = useState("");

    const [isAutoMode, setIsAutoMode] = useState(false);

    const [entities, setEntities] = useState<IEntityRead[]>([]);

    const { push } = useRouter();

    const currentTemplate = useMemo(() => {
        return data?.items.find((template) => template.name === templateName);
    }, [data, templateName]);

    const handleExample = (text: string) => {
        setPrompt(text);
    };

    const handleChangePrompt = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    };

    const handlePromptCompleted = () => {
        setPromptCompleted(true);
    };

    const handleEntitySelect = (selectedEntities: IEntityRead[]) => {
        const newEntities: IEntityRead[] = [];
        selectedEntities.forEach((selectedEntity) => {
            if (entities.find((e) => e.id === selectedEntity.id)) {
                return;
            } else {
                newEntities.push(selectedEntity);
            }
        });
        setEntities([...entities, ...newEntities]);
    };

    const { width } = useWindowSize();

    const { aspecRatio, handleRatioChange, qualityType, handleQualityChange } =
        useAspectRatio();

    const [seed, setSeed] = useState(
        String(Math.floor(Math.random() * 1_000_000_000_000) + 1),
    );

    const [generationConfig, setGenerationConfig] = useState<string | null>(
        "comfyui/flux",
    );

    const [proRequired, setProRequired] = useState<boolean>(false);

    const isDesktop = width > 1000;

    const handleCreateVideo = () => {
        if (!isMinLength) return;
        if (!currentTemplate || !generationConfig) return;

        mutate(
            {
                template_name: currentTemplate.name,
                config: {
                    prompt,
                    aspect_ratio: aspecRatio,
                    image_generation_config_name: generationConfig,
                    auto_mode: isDesktop ? isAutoMode : true,
                    seed: Number(seed),
                    quality: qualityType,
                    entity_ids: entities.map((entity) => entity.id),
                },
            },
            {
                onSuccess: (project) => {
                    const href = getPath(
                        isDesktop
                            ? "PROJECT_VIDEO_EDIT_SCRIPT"
                            : "PROJECT_VIDEO_READONLY",
                        { projectId: project.id },
                    );

                    push(href);
                },
            },
        );
    };

    const isMinLength = prompt.trim().length >= 12;

    const qualityDisable = useMemo(() => {
        return !user?.vip && qualityType === QualityTypeEnum.FULL_HD;
    }, [user, qualityType]);

    if (isPending || isSuccess) {
        return (
            <Flex
                justify="center"
                align="center"
                flexGrow="1"
                gap="2"
            >
                <Spinner />
                <Text color="gray">Preparing your project...</Text>
            </Flex>
        );
    }

    const handleRedirectToCreate = () => {
        push("/my-entities");
    };

    return (
        <>
            <EntitySelectDialog
                onSelect={handleEntitySelect}
                onRedirectToCreate={handleRedirectToCreate}
            />

            <Flex
                justify="center"
                align="center"
                flexGrow="1"
            >
                {!promptCompleted ? (
                    <SuspenseQuery
                        isLoading={isLoading}
                        isError={isError}
                        refetch={refetch}
                    >
                        <Flex
                            justify="center"
                            align="center"
                            direction="column"
                            maxWidth="800px"
                            gap="5"
                            px="2"
                        >
                            <Text className="text-2xl md:text-3xl">
                                🎞️ It&#39;s time to create a{" "}
                                {currentTemplate?.title}
                            </Text>

                            <Flex
                                width="100%"
                                height="170px"
                                flexGrow="1"
                                direction="column"
                                position="relative"
                                mb="5"
                                mt="3"
                                className="rounded-3xl bg-black"
                            >
                                <TextArea
                                    value={prompt}
                                    onChange={handleChangePrompt}
                                    placeholder={
                                        currentTemplate?.prompt_examples?.[0]
                                    }
                                    color="gray"
                                    className="size-full rounded-3xl p-4 pb-14"
                                    size="3"
                                    radius="full"
                                    autoFocus
                                />
                                <EntitySelectLayout
                                    entities={entities}
                                    setEntities={setEntities}
                                />
                                <Flex
                                    className="-translate-x-1/2"
                                    position="absolute"
                                    bottom="-15px"
                                    left="50%"
                                    gap="2"
                                >
                                    <ProjectAutoModeSwitcher
                                        onChange={setIsAutoMode}
                                    />
                                    <Button
                                        variant="classic"
                                        disabled={!isMinLength}
                                        onClick={handlePromptCompleted}
                                    >
                                        <Text
                                            weight="medium"
                                            size="4"
                                        >
                                            NEXT
                                        </Text>
                                        <ArrowRight />
                                    </Button>
                                </Flex>
                            </Flex>
                            <Flex gap="4">
                                {currentTemplate?.prompt_examples?.map(
                                    (example, index) => (
                                        <TemplateExamplePrompt
                                            onClick={handleExample}
                                            prompt={example}
                                            index={index}
                                            key={index}
                                        />
                                    ),
                                )}
                            </Flex>
                        </Flex>
                    </SuspenseQuery>
                ) : (
                    <Card className="my-4">
                        <Flex
                            width="100%"
                            justify="center"
                            align="center"
                            direction="column"
                            gap="3"
                            p="6"
                        >
                            <FileImageGenerationForm.Root
                                onProRequired={setProRequired}
                            >
                                <FileImageGenerationForm.AspectRatio
                                    value={aspecRatio}
                                    onChange={handleRatioChange}
                                    label
                                />

                                <FileImageGenerationForm.GenerationConfig
                                    value={generationConfig}
                                    onChange={setGenerationConfig}
                                    labelProps={{ size: "3", color: "gray" }}
                                />

                                <FileImageGenerationForm.Quality
                                    value={qualityType}
                                    onChange={handleQualityChange}
                                    label
                                />
                                <FileImageGenerationForm.Seed
                                    value={seed}
                                    onChange={setSeed}
                                    label={{
                                        position: "top",
                                        size: "3",
                                        color: "gray",
                                    }}
                                />
                            </FileImageGenerationForm.Root>

                            <Button
                                className="my-2 w-full px-6"
                                onClick={handleCreateVideo}
                                disabled={qualityDisable || proRequired}
                            >
                                NEXT
                            </Button>
                        </Flex>
                    </Card>
                )}
            </Flex>
        </>
    );
};

export default TemplatePage;
