"use client";

import { FileCard, FileCardsSkeleton, useFileList } from "@/entities/file";
import { useProjectData, useProjectGetById } from "@/entities/project";
import { DataImageSelectButton } from "@/features/data";
import { animatingTool, inpaintingTool } from "@/features/file";
import { DataTypeEnum, FileTypeEnum, type IFileRead } from "@/shared/api";
import { getPath } from "@/shared/config";
import { useFileViewer } from "@/shared/hooks";
import { CardList, CheckboxButton , QueryCardList } from "@/shared/ui";

import { Box, Flex, ScrollArea } from "@radix-ui/themes";
import { type FC } from "react";

type Props = {
    projectId: string;
};

export const ProjectImageMediaList: FC<Props> = ({ projectId }) => {
    const { data: project, isLoading: isProjectLoading } = useProjectGetById({
        id: projectId,
    });

    const imageData = useProjectData(project, DataTypeEnum.IMAGE);

    const {
        data: files,
        isLoading: isFileLoading,
        isError,
        refetch,
    } = useFileList({
        projectId,
        types: [FileTypeEnum.IMAGE, FileTypeEnum.VIDEO],
    });

    const addNewRoute = getPath("PROJECT_IMAGE_MEDIA_NEW", { projectId });

    const isLoading = isFileLoading || isProjectLoading;

    const { zoomImage, zoomVideo } = useFileViewer();

    const handleImageClick = (file: IFileRead) => {
        if (file.type === FileTypeEnum.IMAGE) {
            zoomImage(file, [
                inpaintingTool({
                    file,
                    projectId,
                }),
                animatingTool({
                    animatingPrompt: "",
                    file,
                    projectId,
                }),
            ]);
        } else {
            zoomVideo(file);
        }
    };

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
                                href={addNewRoute}
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
                                active={file.id === imageData?.value?.file_id}
                                actionButton={
                                    <DataImageSelectButton data={imageData}>
                                        {(handleClick, isPending) => (
                                            <CheckboxButton
                                                onClick={() => {
                                                    handleClick(file);
                                                }}
                                                isLoading={isPending}
                                                isActive={
                                                    file.id ===
                                                    imageData?.value?.file_id
                                                }
                                            />
                                        )}
                                    </DataImageSelectButton>
                                }
                                contain
                                onClick={handleImageClick}
                            />
                        )}
                    </QueryCardList>
                </ScrollArea>
            </Box>
        </Flex>
    );
};
