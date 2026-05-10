"use client";

import React, { memo, useState } from "react";
import { Box, Flex, Skeleton, Text } from "@radix-ui/themes";
import { Image, TextArea } from "@/shared/ui";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { type ISceneRead } from "@/shared/api";
import { X } from "lucide-react";

type Props = {
    scene: ISceneRead;
    isActive: boolean;
    dense?: boolean;
    readonly?: boolean;
    onClick: () => void;
    onDelete?: () => void;
    onTextChange: (scene: ISceneRead, text: string) => void;
};

const SceneCardComponent = ({
    scene,
    onClick,
    isActive,
    dense,
    readonly,
    onTextChange,
    onDelete,
}: Props) => {
    const height = dense ? "100px" : "170px";

    const sceneText = scene.action_description;

    const [text, setText] = useState(sceneText ?? "");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        onTextChange(scene, value);
        setText(value);
    };

    const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onDelete?.();
    };

    return (
        <Flex
            onClick={onClick}
            direction="column"
            position="relative"
            className={clsx(" w-full cursor-pointer transition-all", {
                [styles.active]: isActive,
            })}
            style={{ minHeight: height }}
        >
            <Flex
                flexGrow="1"
                p="2"
                gapX="5"
                gapY="2"
                justify="center"
            >
                <Flex
                    width="33%"
                    position="relative"
                >
                    <Box
                        position="absolute"
                        width="100%"
                        height="100%"
                    >
                        <Skeleton loading={!scene.file?.url}>
                            <Image
                                style={{
                                    maxHeight: height,
                                }}
                                className="size-full rounded-lg"
                                src={
                                    scene.file?.thumbnail_url ?? scene.file?.url
                                }
                                alt="image"
                                contain
                            />
                        </Skeleton>
                        <Box
                            position="absolute"
                            top="7px"
                            right="7px"
                            onClick={handleDelete}
                            role="button"
                            className="text-gray-500 hover:text-white"
                        >
                            <X size={dense ? "20px" : "24px"} />
                        </Box>
                    </Box>
                </Flex>
                <Flex
                    className="cursor-auto"
                    direction="column"
                    flexGrow="1"
                    flexBasis="0"
                    width="0"
                    gap="2"
                >
                    {dense ? (
                        <TextArea
                            size="1"
                            full
                            color="gray"
                            className={clsx("h-full grow", styles.textarea, {
                                [styles.textarea_active]: isActive,
                            })}
                            value={text}
                            onChange={handleChange}
                            disabled={readonly}
                        ></TextArea>
                    ) : (
                        // <Text
                        //     color="gray"
                        //     size="2"
                        //     className={clsx({
                        //         "line-clamp-5": !isActive,
                        //     })}
                        // >
                        //     {!scene.file && (
                        //         <>
                        //             <Skeleton height="16px" />
                        //             <Skeleton
                        //                 className="mt-2"
                        //                 height="16px"
                        //                 width="70%"
                        //             />
                        //         </>
                        //     )}
                        //     {scene.longline}
                        // </Text>
                        // <TextArea
                        //     size="1"
                        //     color="gray"
                        //     className={clsx(["h-full", styles.textarea])}
                        //     value={text}
                        //     onClick={(e) => {
                        //         e.stopPropagation();
                        //     }}
                        //     onInput={handleChange}
                        //     disabled={readonly}
                        // ></TextArea>
                        <Text
                            size="4"
                            className="line-clamp-5"
                        >
                            {!scene.file && <Skeleton height="26px" />}
                            {sceneText}
                        </Text>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export const SceneCard = memo(SceneCardComponent);
