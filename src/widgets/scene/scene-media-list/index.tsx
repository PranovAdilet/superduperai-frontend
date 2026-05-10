"use client";

import { useEntityList } from "@/entities/entity";
import { FileCard, FileCardsSkeleton, useFileList } from "@/entities/file";
import { useSceneGetById } from "@/entities/scene";
import {
    animatingTool,
    FileActionsList,
    inpaintingTool,
} from "@/features/file";
import { SceneSelectButton } from "@/features/scene";
import { FileTypeEnum, type IFileRead } from "@/shared/api";
import { getPath } from "@/shared/config";
import { useFileViewer } from "@/shared/hooks";
import { CardList, CheckboxButton , QueryCardList } from "@/shared/ui";

import { Box, Flex, ScrollArea } from "@radix-ui/themes";
import { useCallback, type FC } from "react";

type Props = {
    sceneId: string;
    projectId: string;
};

export const StoryboardSceneMediaList: FC<Props> = ({ projectId, sceneId }) => {
    const { data: scene, isLoading: isSceneLoading } = useSceneGetById({
        id: sceneId,
    });

    const {
        data: files,
        isLoading: isFileLoading,
        isError,
        refetch,
    } = useFileList({
        projectId,
        sceneId,
        types: [FileTypeEnum.IMAGE, FileTypeEnum.VIDEO],
    });

    const isLoading = isFileLoading || isSceneLoading;

    const { zoomImage, zoomVideo } = useFileViewer();

    const { data: entities } = useEntityList({ projectId });

    const getFileEntities = useCallback(
        (file: IFileRead | null) => {
            return entities?.items.filter((entity) => {
                return file?.image_generation?.entity_ids.find(
                    (e) => e === entity.id,
                );
            });
        },
        [entities],
    );

    const handleImageClick = (file: IFileRead) => {
        if (file.type === FileTypeEnum.IMAGE) {
            zoomImage(file, [
                inpaintingTool({
                    file,
                    projectId,
                    sceneId,
                }),
                animatingTool({
                    animatingPrompt: scene?.action_description,
                    file,
                    projectId,
                    sceneId,
                }),
            ]);
        } else {
            zoomVideo(file);
        }
    };

    const routePath = getPath("PROJECT_VIDEO_STORYBOARD_SCENE_MEDIA_NEW", {
        projectId,
        sceneId,
    });

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
                            <CardList.NewItem
                                width="150px"
                                href={routePath}
                            />
                        }
                        fallbackLoading={
                            <FileCardsSkeleton
                                wrap="nowrap"
                                direction="row"
                                size="150px"
                            />
                        }
                    >
                        {(file) => (
                            <FileCard
                                file={file}
                                active={file.id === scene?.file_id}
                                actionButton={
                                    <SceneSelectButton scene={scene}>
                                        {(handleClick, isPending) => (
                                            <CheckboxButton
                                                onClick={() => {
                                                    handleClick(file);
                                                }}
                                                isLoading={isPending}
                                                isActive={
                                                    file.id === scene?.file_id
                                                }
                                            />
                                        )}
                                    </SceneSelectButton>
                                }
                                actionsList={
                                    <FileActionsList fileId={file.id} />
                                }
                                contain
                                onClick={handleImageClick}
                                getFileEntities={getFileEntities}
                            />
                        )}
                    </QueryCardList>
                </ScrollArea>
            </Box>
        </Flex>
    );
};
