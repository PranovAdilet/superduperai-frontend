"use client";

import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import { CircleCheck } from "lucide-react";
import clsx from "clsx";
import { TaskStatusEnum, TaskTypeEnum, type IMusicRead } from "@/shared/api";
import { timeFormat } from "@/shared/utils";
import { MusicThumbnail } from "@/shared/ui";
import { useMemo, type MouseEvent } from "react";

type MusicCardProps = {
    music: IMusicRead;
    isSelect: boolean;
    onSelect: (music: IMusicRead) => void;
};

export function MusicCard({ music, onSelect, isSelect }: MusicCardProps) {
    const handleSelect = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onSelect(music);
    };

    const isGenerating = useMemo(() => {
        return (
            music.file.tasks?.find(
                (task) => task.type === TaskTypeEnum.MUSICBEATS_METADATA_FLOW,
            )?.status === TaskStatusEnum.IN_PROGRESS
        );
    }, [music]);

    return (
        <button
            onClick={handleSelect}
            className={clsx(
                "group cursor-pointer overflow-hidden rounded-lg p-0 transition-colors duration-300 ease-in-out hover:bg-black",
                {
                    ["bg-black"]: isSelect,
                },
            )}
        >
            <Flex
                justify="between"
                align="center"
                gapX="4"
                py="3"
                px="5"
            >
                <Flex
                    justify="between"
                    align="center"
                    flexGrow="1"
                >
                    <Flex
                        align="center"
                        gap="3"
                    >
                        <Box
                            width="70px"
                            height="70px"
                            flexShrink="0"
                        >
                            <MusicThumbnail thumbnail={music.thumbnail_url} />
                        </Box>
                        <Flex
                            direction="column"
                            align="start"
                            gapY="1"
                        >
                            <Text
                                as="p"
                                size="4"
                            >
                                {music.title}
                            </Text>
                            <Text
                                as="p"
                                size="2"
                                color="gray"
                                className="opacity-90"
                            >
                                {music.artist ?? "Unknown"}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex
                        pr="9"
                        align="center"
                        gap="2"
                    >
                        <Text weight="medium">bpm:</Text>
                        <Text>
                            {isGenerating ? (
                                <Spinner />
                            ) : (
                                (music.audio_metadata?.bpm ?? 0)
                            )}
                        </Text>
                    </Flex>
                </Flex>
                <Flex align="center">
                    <Text
                        as="div"
                        color={isSelect ? "lime" : "gray"}
                        weight="bold"
                        className={clsx(
                            "hidden opacity-0 group-hover:block group-hover:opacity-100",
                            {
                                ["!block opacity-100"]: isSelect,
                            },
                        )}
                    >
                        <Flex
                            gapX="2"
                            align="center"
                        >
                            <Text>{isSelect ? "Selected" : "Select"}</Text>
                            <CircleCheck />
                        </Flex>
                    </Text>
                    <Text
                        weight="medium"
                        className={clsx(
                            "block opacity-100 group-hover:hidden group-hover:opacity-0",
                            {
                                ["hidden opacity-0"]: isSelect,
                            },
                        )}
                    >
                        {timeFormat(music.duration ?? 0)}
                    </Text>
                </Flex>
            </Flex>
        </button>
    );
}
