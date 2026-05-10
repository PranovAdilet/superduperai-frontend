"use client";

import type { ReactNode, FC } from "react";

import { type IEntityRead } from "@/shared/api";
import { Box, Button, Flex, Skeleton, Text } from "@radix-ui/themes";
import { Image, Link } from "@/shared/ui";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { X } from "lucide-react";

type Props = {
    entity: IEntityRead;
    href?: string;
    dense?: boolean;
    active?: boolean;
    onDelete?: () => void;
    onClick?: () => void;
    onAddToProject?: (entity: IEntityRead) => void;
    onImageClick?: (file: IEntityRead) => void;
    favoriteButton?: ReactNode;
};

export const EntityCard: FC<Props> = ({
    entity,
    href,
    dense,
    active,
    onClick,
    onDelete,
    onImageClick,
    onAddToProject,
    favoriteButton,
}) => {
    const height = dense ? undefined : "260px";

    const isGenerating = entity.file?.url === null;

    const handleZoom = () => {
        if (!entity.file) return;
        onImageClick?.(entity);
    };

    return (
        <Flex
            position="relative"
            className={clsx("w-full rounded-xl ", styles.card, {
                [styles.active]: active,
            })}
            minHeight={height}
            direction="column"
            p="1"
            onClick={onClick}
        >
            <Flex
                direction="column"
                flexGrow="1"
                justify="center"
                align="center"
                onClick={handleZoom}
            >
                {isGenerating && (
                    <Box position="absolute">
                        <Text color="gray">Image Generation</Text>
                    </Box>
                )}
                <Skeleton loading={isGenerating}>
                    <Image
                        className="grow rounded-xl"
                        src={entity.file?.thumbnail_url}
                        alt={entity.name}
                        contain
                    />
                </Skeleton>
            </Flex>
            <Flex
                p="2"
                gap="1"
                direction="column"
            >
                <Flex gap="2">
                    <Flex
                        flexGrow="1"
                        flexBasis="0"
                        width="0"
                        overflow="hidden"
                    >
                        <Text
                            wrap="nowrap"
                            truncate={true}
                        >
                            {entity.name}
                        </Text>
                    </Flex>

                    {href && <Link href={href}>Edit</Link>}
                    {onAddToProject && (
                        <Button
                            onClick={() => {
                                onAddToProject(entity);
                            }}
                            variant="ghost"
                        >
                            <Text
                                weight="medium"
                                size="3"
                            >
                                Select
                            </Text>
                        </Button>
                    )}
                </Flex>
                <Flex
                    justify="between"
                    align="center"
                >
                    <Text
                        size="1"
                        color="gray"
                    >
                        {entity.type}
                    </Text>
                </Flex>
                {favoriteButton}

                {onDelete && (
                    <Box
                        position="absolute"
                        top="7px"
                        right="7px"
                        onClick={onDelete}
                        role="button"
                        className="text-gray-500 hover:text-white"
                    >
                        <X color="gray" />
                    </Box>
                )}
            </Flex>
        </Flex>
    );
};
