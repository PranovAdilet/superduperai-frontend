"use client";

import { Card, Flex, Text } from "@radix-ui/themes";
import { Sparkles, X } from "lucide-react";
import { useFileGenerateVideo } from "@/features/file";
import type { IFileRead } from "@/shared/api";
import { ReferenceTypeEnum } from "@/shared/api";
import type { AnimatingDataProps } from "./animating-form";
import { AnimatingForm } from "./animating-form";
import { useEffect } from "react";
import { useModal } from "@/shared/store";
import { useSceneGetById } from "@/entities/scene";
import { useSceneUpdate } from "@/features/scene";
import clsx from "clsx";

type Props = {
    projectId: string;
    sceneId?: string;
    animatingPrompt?: string;
    file: IFileRead;
    onGenerating?: () => void;
    isActive?: boolean;
};

type ControlProps = {
    active?: string;
    setActive: (value: string) => void;
};

export const getAnimatingControl =
    ({
        projectId,
        sceneId,
        animatingPrompt,
        file,
        onGenerating,
        isActive,
    }: Props) =>
    ({ active, setActive }: ControlProps) => {
        const { data: scene } = useSceneGetById(
            {
                id: sceneId!,
            },
            {
                enabled: !!sceneId,
            },
        );

        const { mutate: updateScene } = useSceneUpdate();

        const { mutateAsync: generateVideo, isPending } =
            useFileGenerateVideo();

        const { close } = useModal();

        const handleChildClick = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
        };

        const handleAnimatingComplete = async ({
            prompt,
            generationConfig,
            duration,
            negativePrompt,
        }: AnimatingDataProps) => {
            await generateVideo(
                {
                    requestBody: {
                        project_id: projectId,
                        scene_id: sceneId,
                        config: {
                            generation_config_name: generationConfig,
                            prompt,
                            negative_prompt: negativePrompt,
                            duration: duration ?? 5,
                            references: [
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

                        if (!scene || !sceneId) return;
                        updateScene({
                            id: sceneId,
                            requestBody: { ...scene, file_id: data.id },
                        });
                    },
                },
            );
        };
        const handleAnimating = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();

            if (active) {
                setActive("");
                if (isActive) {
                    close();
                }
            } else {
                setActive("animating");
            }
        };

        useEffect(() => {
            return () => {
                setActive("");
            };
        }, []);

        useEffect(() => {
            if (!isActive) return;
            setActive("animating");
        }, []);
        return (
            <Flex
                style={{
                    height: active === "animating" ? "100%" : "50px",
                    transition: "height 0.25s ease-in-out",
                }}
                overflow="hidden"
                onClick={handleChildClick}
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
                        <Flex
                            role="button"
                            gap="3"
                            onClick={handleAnimating}
                            className={clsx({
                                " hover:text-red-600": active,
                                " hover:text-lime-400": !active,
                            })}
                        >
                            {active ? (
                                <>
                                    <X />
                                    <Text>CLOSE</Text>
                                </>
                            ) : (
                                <>
                                    <Sparkles />
                                    <Text>ANIMATING</Text>
                                </>
                            )}
                        </Flex>
                        {active === "animating" && (
                            <AnimatingForm
                                prompt={animatingPrompt}
                                onComplete={handleAnimatingComplete}
                                loading={isPending}
                            />
                        )}
                    </Flex>
                </Card>
            </Flex>
        );
    };
