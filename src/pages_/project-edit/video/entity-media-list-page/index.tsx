"use client";

import { useEntityGetById } from "@/entities/entity";
import { FileCard, FileCardsSkeleton, useFileList } from "@/entities/file";
import { ProjectStep } from "@/entities/project";
import { EntitySelectButton } from "@/features/entity";
import { FileActionsList } from "@/features/file";
import { inpaintingTool } from "@/features/file/generate-image";
import { FileTypeEnum, type IFileRead } from "@/shared/api";
import { useFileViewer } from "@/shared/hooks";
import { BackButton, CardList, CheckboxButton } from "@/shared/ui";
import { QueryCardList } from "@/shared/ui/query-card-list";
import { Flex, Text } from "@radix-ui/themes";
import { getPath } from "@/shared/config/routes";
import { useMemo, type FC } from "react";

type Props = {
    entityId: string;
    projectId?: string;
};

export const EntityMediaListPage: FC<Props> = ({ projectId, entityId }) => {
    const { data: entity, isLoading: isEntityLoading } = useEntityGetById({
        id: entityId,
    });

    const {
        data: files,
        isLoading: isFileLoading,
        isError,
        refetch,
    } = useFileList({
        entityId,
    });

    const backRoute = useMemo(() => {
        return projectId
            ? getPath("PROJECT_VIDEO_EDIT_ENTITY_DETAIL", {
                  projectId,
                  entityId,
              })
            : getPath("MY_ENTITY_DETAIL", { entityId });
    }, [projectId, entityId]);

    const addNewRoute = useMemo(() => {
        return projectId
            ? getPath("PROJECT_VIDEO_EDIT_ENTITY_MEDIA_NEW", {
                  projectId,
                  entityId,
              })
            : getPath("MY_ENTITY_MEDIA_NEW", { entityId });
    }, [projectId, entityId]);

    const isLoading = isFileLoading || isEntityLoading;

    const { zoomImage, zoomVideo } = useFileViewer();

    const handleImageClick = (file: IFileRead) => {
        if (file.type === FileTypeEnum.IMAGE) {
            zoomImage(file, [
                inpaintingTool({
                    file,
                    projectId,
                    entityId,
                }),
            ]);
        } else {
            zoomVideo(file);
        }
    };

    return (
        <ProjectStep>
            <ProjectStep.Root>
                <Flex
                    p="6"
                    direction="column"
                    gap="6"
                >
                    <BackButton route={backRoute} />
                    <Text size="6">{entity?.name}</Text>
                    <QueryCardList
                        items={files?.items}
                        isError={isError}
                        isLoading={isLoading}
                        refetch={refetch}
                        direction="row"
                        wrap="wrap"
                        fallbackLoading={
                            <FileCardsSkeleton
                                wrap="wrap"
                                direction="row"
                            />
                        }
                        appendItem={<CardList.NewItem href={addNewRoute} />}
                    >
                        {(file) => (
                            <FileCard
                                file={file}
                                active={file.id === entity?.file_id}
                                onClick={handleImageClick}
                                contain
                                actionButton={
                                    <EntitySelectButton entity={entity}>
                                        {(handleClick, isPending) => (
                                            <CheckboxButton
                                                onClick={() => {
                                                    handleClick(file);
                                                }}
                                                isLoading={isPending}
                                                isActive={
                                                    file.id === entity?.file_id
                                                }
                                            />
                                        )}
                                    </EntitySelectButton>
                                }
                                actionsList={
                                    <FileActionsList fileId={file.id} />
                                }
                            />
                        )}
                    </QueryCardList>
                </Flex>
            </ProjectStep.Root>
        </ProjectStep>
    );
};

export default EntityMediaListPage;
