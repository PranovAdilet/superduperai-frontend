"use client";

import {
    EntityCard,
    EntityCardsSkeleton,
    useEntityList,
} from "@/entities/entity";
import {
    ProjectNextBtn,
    ProjectStep,
    useProjectGetById,
} from "@/entities/project";
import { useTaskStatus } from "@/entities/task";
import { useUserMe } from "@/entities/user";
import { EntityFavoriteButton, useEntityDelete } from "@/features/entity";
import {
    useProjectScript2Storyboard,
    useProjectVideoScript2Entities,
} from "@/features/project-video";
import type { IEntityRead } from "@/shared/api";
import { FileTypeEnum, TaskTypeEnum } from "@/shared/api";
import { useFileViewer } from "@/shared/hooks";
import { useModal } from "@/shared/store";
import { CardList, QueryCardList, RegenerateErrorButton } from "@/shared/ui";
import { DeleteDialog } from "@/shared/ui/delete-dialog";
import { Box, Strong, Text } from "@radix-ui/themes";
import { useIsMutating } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { getPath } from "@/shared/config/routes";
import { useEffect, type FC } from "react";

type Props = { projectId: string };

const EntitiesListPage: FC<Props> = ({ projectId }) => {
    const { push, prefetch } = useRouter();

    const nextRoutePath = getPath("PROJECT_VIDEO_EDIT_STORYBOARD_ROOT", {
        projectId,
    });

    const {
        data: entities,
        isLoading,
        isError,
        refetch,
    } = useEntityList({ projectId });

    const { data: user } = useUserMe();

    const { data: myEntities } = useEntityList(
        {
            userId: user?.id,
        },
        { enabled: !!user },
    );

    const { data: project } = useProjectGetById({ id: projectId });

    const isMutating = useIsMutating({
        mutationKey: [TaskTypeEnum.SCRIPT2STORYBOARD_FLOW, projectId],
    });

    const { isPending, isError: isScript2EntitiesError } = useTaskStatus(
        TaskTypeEnum.SCRIPT2ENTITIES_FLOW,
        project?.tasks,
    );

    useEffect(() => {
        prefetch(nextRoutePath);
    }, [prefetch, nextRoutePath]);

    const loading = isLoading || (isPending && entities?.items.length === 0);

    const { mutateAsync: storyboard, isPending: isScript2StoryboardPending } =
        useProjectScript2Storyboard([
            TaskTypeEnum.SCRIPT2STORYBOARD_FLOW,
            projectId,
        ]);

    const { isExists: isStoryboardExists } = useTaskStatus(
        TaskTypeEnum.SCRIPT2STORYBOARD_FLOW,
        project?.tasks,
    );

    const handleNext = async () => {
        try {
            if (!isStoryboardExists) {
                await storyboard({
                    ...project,
                    id: projectId,
                });
            }

            push(nextRoutePath);
        } catch (error: unknown) {
            console.error("Failed to generate storyboard:", error);
        }
    };

    const { open, close } = useModal();

    const { mutate, isPending: isDeleting } = useEntityDelete();

    const handleDelete = (entity?: IEntityRead) => {
        if (!entity) return;
        mutate(
            { id: entity.id },
            {
                onSuccess() {
                    close();
                },
            },
        );
    };

    const { zoomImage, zoomVideo } = useFileViewer();

    const handleImageClick = (entity: IEntityRead) => {
        if (!entity.file) return;

        if (entity.file.type === FileTypeEnum.IMAGE) {
            zoomImage(entity.file);
        } else {
            zoomVideo(entity.file);
        }
    };

    const { mutate: regenerateEntities, isPending: isRegenerating } =
        useProjectVideoScript2Entities();

    const handleRegenerate = () => {
        regenerateEntities({
            id: projectId,
        });
    };

    return (
        <ProjectStep>
            <ProjectStep.Root>
                <Box
                    height="100%"
                    p="6"
                >
                    <QueryCardList
                        items={entities?.items}
                        refetch={refetch}
                        isLoading={loading}
                        isError={isError || isScript2EntitiesError}
                        direction="row"
                        wrap="wrap"
                        fallbackError={() => (
                            <RegenerateErrorButton
                                isPending={isRegenerating}
                                onRegenerate={handleRegenerate}
                            />
                        )}
                        appendItem={
                            <CardList.NewItem
                                width="150px"
                                href={getPath(
                                    "PROJECT_VIDEO_EDIT_ENTITIES_ADD",
                                    { projectId },
                                )}
                            />
                        }
                        fallbackLoading={<EntityCardsSkeleton />}
                        placeholder={
                            <Text
                                size="6"
                                className="px-4"
                            >
                                No entities are required for this script, you
                                can skip this step.
                                <br />
                                Use the{" "}
                                <Strong className="text-lime-500">
                                    NEXT
                                </Strong>{" "}
                                button.
                            </Text>
                        }
                    >
                        {(entity) => (
                            <EntityCard
                                entity={entity}
                                href={getPath(
                                    "PROJECT_VIDEO_EDIT_ENTITY_DETAIL",
                                    {
                                        projectId,
                                        entityId: entity.id,
                                    },
                                )}
                                onDelete={() => {
                                    open("deleteDialog", entity);
                                }}
                                onImageClick={handleImageClick}
                                favoriteButton={
                                    <EntityFavoriteButton
                                        entityId={entity.id}
                                        myEntities={myEntities?.items}
                                        isFavorite={myEntities?.items.some(
                                            (item) => item.id === entity.id,
                                        )}
                                    />
                                }
                            />
                        )}
                    </QueryCardList>
                </Box>
                <DeleteDialog
                    onDelete={handleDelete}
                    isPending={isDeleting}
                    label="entity"
                />
            </ProjectStep.Root>
            <ProjectStep.Footer>
                <ProjectNextBtn
                    disabled={loading || isPending}
                    loading={isScript2StoryboardPending || !!isMutating}
                    onClick={handleNext}
                />
            </ProjectStep.Footer>
        </ProjectStep>
    );
};

export default EntitiesListPage;
