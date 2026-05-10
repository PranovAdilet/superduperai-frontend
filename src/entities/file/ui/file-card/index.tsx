"use client";

import { type ReactNode, useMemo, type FC } from "react";
import { type IEntityRead, FileTypeEnum, type IFileRead } from "@/shared/api";
import { Box, Flex, Text } from "@radix-ui/themes";
import { AudioPlayer, Image, Popover } from "@/shared/ui";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Ban, Info, Music, User, Settings, Hash } from "lucide-react";
import { FileGeneratingCard } from "../file-generating-card";

type Props = {
    file: IFileRead | null;
    active?: boolean;
    actionButton?: ReactNode;
    contain?: boolean;
    className?: string;
    onClick?: (file: IFileRead) => void;
    getFileEntities?: (file: IFileRead | null) => IEntityRead[] | undefined;
    actionsList?: ReactNode;
};

export const FileCard: FC<Props> = ({
    file,
    active,
    actionButton,
    contain,
    className,
    onClick,
    getFileEntities,
    actionsList,
}) => {
    const isGenerating = file?.url === null;

    const handleClick = () => {
        if (!file) return;
        onClick?.(file);
    };

    const entities = useMemo(
        () => getFileEntities?.(file),
        [file, getFileEntities],
    );

    if (!file)
        return (
            <Flex
                height="100%"
                minHeight="150px"
                direction="column"
                justify="center"
                align="center"
                p="1"
                className={clsx(className, styles.card, {
                    [styles.active]: active,
                })}
            >
                <Ban />
                <Flex
                    position="absolute"
                    top="6px"
                    right="6px"
                >
                    {actionButton}
                </Flex>
            </Flex>
        );

    return (
        <Flex
            height="100%"
            minHeight="150px"
            direction="column"
            justify="center"
            align="center"
            p="1"
            className={clsx(className, styles.card, {
                [styles.active]: active,
            })}
            onClick={handleClick}
        >
            {isGenerating ? (
                <>
                    <FileGeneratingCard
                        actionButton={actionButton}
                        file={file}
                    />
                    {actionsList}
                </>
            ) : [FileTypeEnum.IMAGE, FileTypeEnum.VIDEO].includes(file.type) ? (
                <Image
                    className="grow rounded-xl"
                    src={file.thumbnail_url}
                    alt="file"
                    contain={contain}
                    isVideo={file.type === FileTypeEnum.VIDEO}
                >
                    {actionsList}
                    <PopoverLayout
                        file={file}
                        entities={entities}
                    />
                    <Flex
                        position="absolute"
                        top="6px"
                        right="6px"
                    >
                        {actionButton}
                    </Flex>
                </Image>
            ) : (
                <Flex
                    className="rounded-xl bg-zinc-950"
                    position="relative"
                    justify="center"
                    align="center"
                    flexGrow="1"
                    width="100%"
                >
                    <Music size="40px" />
                    <Flex
                        position="absolute"
                        top="6px"
                        right="6px"
                    >
                        {actionButton}
                    </Flex>
                    <Box
                        position="absolute"
                        bottom="16px"
                        className="z-20"
                    >
                        <AudioPlayer
                            src={file.url}
                            allowDownload={!!file.url}
                        />
                    </Box>
                </Flex>
            )}
        </Flex>
    );
};

const PopoverLayout = ({
    file,
    entities,
}: {
    file?: IFileRead;
    entities?: IEntityRead[];
}) => {
    const prompt =
        file?.image_generation?.prompt ??
        file?.video_generation?.prompt ??
        file?.audio_generation?.prompt;

    const modelName =
        file?.type === FileTypeEnum.VIDEO
            ? file.video_generation?.generation_config?.label
            : file?.image_generation?.generation_config_name;

    const seed = file?.image_generation?.seed ?? file?.video_generation?.seed;

    return (
        <Box
            position="absolute"
            bottom="6px"
            right="6px"
            className="z-20 rounded-full bg-black/60 p-2 backdrop-blur-sm transition-colors duration-200 hover:bg-black/70"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            {prompt && (
                <Popover
                    trigger={
                        <Info
                            className="text-white transition-colors duration-200 hover:text-blue-400"
                            size={18}
                        />
                    }
                >
                    <Flex
                        direction="column"
                        gap="4"
                        width="320px"
                        className="rounded-xl border border-slate-700/50  shadow-2xl"
                        p="5"
                    >
                        {/* Entities Section */}
                        {entities && entities.length > 0 && (
                            <Flex
                                direction="column"
                                gap="3"
                            >
                                <Flex
                                    align="center"
                                    gap="2"
                                    className="border-b border-slate-700/30 pb-2"
                                >
                                    <User
                                        size={16}
                                        className="text-blue-400"
                                    />
                                    <Text
                                        weight="bold"
                                        className="text-sm text-slate-100"
                                    >
                                        Entities ({entities.length})
                                    </Text>
                                </Flex>
                                <Flex
                                    wrap="wrap"
                                    gap="3"
                                    className=" max-h-32 overflow-y-auto"
                                >
                                    {entities.map((entity) => (
                                        <Flex
                                            gap="2"
                                            align="center"
                                            key={entity.id}
                                            className="min-w-0 flex-1 basis-[calc(50%-0.375rem)] rounded-lg bg-slate-800/50 p-2 transition-colors duration-200 hover:bg-slate-700/50"
                                        >
                                            <Box className="shrink-0">
                                                <Image
                                                    src={entity.file?.url}
                                                    width="32px"
                                                    height="32px"
                                                    className="rounded-lg border border-slate-600/30 object-cover"
                                                />
                                            </Box>
                                            <Text className="truncate text-xs font-medium text-slate-200">
                                                {entity.name}
                                            </Text>
                                        </Flex>
                                    ))}
                                </Flex>
                            </Flex>
                        )}

                        {/* Model Section */}
                        {modelName && (
                            <Flex
                                direction="column"
                                gap="2"
                            >
                                <Flex
                                    align="center"
                                    gap="2"
                                    className="border-b border-slate-700/30 pb-2"
                                >
                                    <Settings
                                        size={16}
                                        className="text-green-400"
                                    />
                                    <Text
                                        weight="bold"
                                        className="text-sm text-slate-100"
                                    >
                                        Model
                                    </Text>
                                </Flex>
                                <Box className="rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-green-400/10 p-3">
                                    <Text className="text-sm font-semibold text-green-300">
                                        {modelName}
                                    </Text>
                                </Box>
                            </Flex>
                        )}

                        {/* Seed Section */}
                        {seed && (
                            <Flex
                                direction="column"
                                gap="2"
                            >
                                <Flex
                                    align="center"
                                    gap="2"
                                    className="border-b border-slate-700/30 pb-2"
                                >
                                    <Hash
                                        size={16}
                                        className="text-purple-400"
                                    />
                                    <Text
                                        weight="bold"
                                        className="text-sm text-slate-100"
                                    >
                                        Seed
                                    </Text>
                                </Flex>
                                <Box className="rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-purple-400/10 p-3">
                                    <Text className="font-mono text-sm text-purple-300">
                                        {seed}
                                    </Text>
                                </Box>
                            </Flex>
                        )}

                        {/* Prompt Section */}
                        <Flex
                            direction="column"
                            gap="2"
                        >
                            <Flex
                                align="center"
                                gap="2"
                                className="border-b border-slate-700/30 pb-2"
                            >
                                <Info
                                    size={16}
                                    className="text-amber-400"
                                />
                                <Text
                                    weight="bold"
                                    className="text-sm text-slate-100"
                                >
                                    Prompt
                                </Text>
                            </Flex>
                            <Box className=" max-h-40 overflow-y-auto rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-400/10 p-4">
                                <Text className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
                                    {prompt}
                                </Text>
                            </Box>
                        </Flex>
                    </Flex>
                </Popover>
            )}
        </Box>
    );
};
