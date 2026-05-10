"use client";

import { FileCard, FileCardsSkeleton, useFileList } from "@/entities/file";
import { useSceneGetById } from "@/entities/scene";
import { SceneVoiceoverSelectButton } from "@/features/scene";
import { FileTypeEnum } from "@/shared/api";
import { getPath } from "@/shared/config";
import { CardList, CheckboxButton , QueryCardList } from "@/shared/ui";

import { Box, Flex, ScrollArea } from "@radix-ui/themes";
import { type FC } from "react";

type Props = {
    sceneId: string;
    projectId: string;
};

export const StoryboardSceneVoiceoverList: FC<Props> = ({
    projectId,
    sceneId,
}) => {
    const { data: scene, isLoading: isSceneLoading } = useSceneGetById({
        id: sceneId,
    });

    const {
        data: files,
        isLoading: isFilesLoading,
        isError,
        refetch,
    } = useFileList({
        projectId,
        sceneId,
        types: [FileTypeEnum.VOICEOVER],
    });

    const addNewRoute = getPath(
        "PROJECT_VIDEO_STORYBOARD_SCENE_VOICEOVER_NEW",
        {
            projectId,
            sceneId,
        },
    );

    const isLoading = isFilesLoading || isSceneLoading;

    return (
        <Flex
            width="100%"
            height="100%"
        >
            <Box
                flexGrow="1"
                flexBasis="0"
                width="0"
                height="100%"
            >
                <ScrollArea scrollbars="horizontal">
                    <QueryCardList
                        items={files?.items}
                        isError={isError}
                        isLoading={isLoading}
                        refetch={refetch}
                        direction="row"
                        itemSize="150px"
                        appendItem={
                            <>
                                <CardList.NewItem
                                    width="150px"
                                    href={addNewRoute}
                                />
                                <CardList.Item size="150px">
                                    <FileCard
                                        file={null}
                                        active={null === scene?.voiceover_id}
                                        contain
                                        actionButton={
                                            <SceneVoiceoverSelectButton
                                                scene={scene}
                                            >
                                                {(handleClick, isPending) => (
                                                    <CheckboxButton
                                                        onClick={() => {
                                                            handleClick(null);
                                                        }}
                                                        isLoading={isPending}
                                                        isActive={
                                                            null ===
                                                            scene?.voiceover_id
                                                        }
                                                    />
                                                )}
                                            </SceneVoiceoverSelectButton>
                                        }
                                    />
                                </CardList.Item>
                            </>
                        }
                        placeholder={
                            <CardList.NewItem
                                width="150px"
                                href={addNewRoute}
                            />
                        }
                        fallbackLoading={
                            <FileCardsSkeleton
                                direction="row"
                                size="150px"
                            />
                        }
                    >
                        {(file) => (
                            <FileCard
                                file={file}
                                active={file.id === scene?.voiceover_id}
                                contain
                                actionButton={
                                    <SceneVoiceoverSelectButton scene={scene}>
                                        {(handleClick, isPending) => (
                                            <CheckboxButton
                                                onClick={() => {
                                                    handleClick(file);
                                                }}
                                                isLoading={isPending}
                                                isActive={
                                                    file.id ===
                                                    scene?.voiceover_id
                                                }
                                            />
                                        )}
                                    </SceneVoiceoverSelectButton>
                                }
                            />
                        )}
                    </QueryCardList>
                </ScrollArea>
            </Box>
        </Flex>
    );
};
