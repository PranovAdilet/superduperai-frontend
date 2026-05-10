"use client";

import type { IFileRead } from "@/shared/api";
import { FileTypeEnum } from "@/shared/api";
import { Box, Button, Flex, Skeleton, Text } from "@radix-ui/themes";
import type { FC, ReactNode } from "react";
import { useFileError } from "../../hooks/use-file-errors";

type Props = {
    file: IFileRead;
    onRemove?: () => void;
    onRegenerate?: () => void;
    actionButton?: ReactNode;
};

export const FileGeneratingCard: FC<Props> = ({
    file,
    onRemove,
    onRegenerate,
    actionButton,
}) => {
    const { fileError, isLipsync } = useFileError({ fileId: file.id });
    return (
        <>
            <Skeleton>
                <Box
                    className="rounded-xl"
                    flexGrow="1"
                    width="100%"
                    height="100%"
                />
            </Skeleton>
            <Flex
                position="absolute"
                width="100%"
                height="100%"
                justify="center"
                align="center"
            >
                <Flex
                    position="absolute"
                    top="6px"
                    right="6px"
                >
                    {actionButton}
                </Flex>
                {file.type === FileTypeEnum.VIDEO ? (
                    <Flex
                        direction="column"
                        gap="1"
                        align="center"
                    >
                        <Text>Video Generation</Text>
                        <Text
                            size="2"
                            color="gray"
                            align="center"
                        >
                            {fileError && isLipsync
                                ? "Error: Face not detected"
                                : " 5-10 minutes"}
                        </Text>
                        {fileError && (
                            <Flex gap="3">
                                {onRemove && (
                                    <Button
                                        color="red"
                                        onClick={onRemove}
                                    >
                                        Remove
                                    </Button>
                                )}
                                {onRegenerate && (
                                    <Button
                                        color="lime"
                                        onClick={onRegenerate}
                                    >
                                        Regenerate
                                    </Button>
                                )}
                            </Flex>
                        )}
                    </Flex>
                ) : file.type === FileTypeEnum.IMAGE ? (
                    <Text align="center">Image Generation</Text>
                ) : (
                    <Text align="center">Audio Generation</Text>
                )}
            </Flex>
        </>
    );
};
