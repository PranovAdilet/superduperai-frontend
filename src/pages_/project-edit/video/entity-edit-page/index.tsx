"use client";

import { Button, Flex, Separator, Skeleton, Text } from "@radix-ui/themes";
import type { EntityData } from "@/entities/entity";
import { EntityForm, useEntityGetById } from "@/entities/entity";
import { useEntityUpdate } from "@/features/entity";
import { type IEntityUpdate } from "@/shared/api";
import { ProjectStep } from "@/entities/project";
import { BackButton, Image, Link, SuspenseQuery } from "@/shared/ui";
import { useMemo, type FC } from "react";
import { getPath } from "@/shared/config/routes";

type Props = {
    entityId: string;
    projectId?: string;
};

const EntityEditPage: FC<Props> = ({ projectId, entityId }) => {
    const {
        data: entity,
        isLoading,
        isError,
        refetch,
    } = useEntityGetById({ id: entityId });

    const { mutate, isPending } = useEntityUpdate();

    const handleSubmit = (data: EntityData) => {
        mutate(data as IEntityUpdate);
    };

    const backRoute = useMemo(() => {
        return projectId
            ? getPath("PROJECT_VIDEO_EDIT_ENTITIES", { projectId })
            : getPath("MY_ENTITIES");
    }, [projectId]);

    const mediaRoute = useMemo(() => {
        return projectId
            ? getPath("PROJECT_VIDEO_EDIT_ENTITY_MEDIA", {
                  projectId,
                  entityId,
              })
            : getPath("MY_ENTITY_MEDIA", { entityId });
    }, [projectId, entityId]);

    const isGenerating = entity?.file?.url === null;

    return (
        <ProjectStep>
            <Flex
                pt="6"
                px="6"
                gap="2"
                direction="column"
            >
                <BackButton route={backRoute} />
                <Separator size="4" />
            </Flex>
            <SuspenseQuery
                isLoading={isLoading}
                isError={isError}
                refetch={refetch}
            >
                <ProjectStep.Root>
                    <Flex
                        direction="column"
                        gapY="4"
                        p="6"
                    >
                        <Skeleton loading={isGenerating}>
                            <Image
                                className="rounded-xl bg-black"
                                src={entity?.file?.url}
                                height="400px"
                                alt="avatar"
                                contain
                            />
                        </Skeleton>
                        <Flex justify="end">
                            <Link
                                size="5"
                                href={mediaRoute}
                            >
                                <Text weight="medium">EDIT IMAGE</Text>
                            </Link>
                        </Flex>
                        {entity && (
                            <EntityForm
                                entity={entity}
                                onSubmit={handleSubmit}
                                type={entity.type}
                            />
                        )}
                    </Flex>
                </ProjectStep.Root>
                <ProjectStep.Footer>
                    <Flex gapX="3">
                        <Button
                            className="w-[150px]"
                            variant="classic"
                            loading={isPending}
                            form={EntityForm.ID}
                        >
                            <Text
                                weight="medium"
                                size="2"
                            >
                                Save
                            </Text>
                        </Button>
                    </Flex>
                </ProjectStep.Footer>
            </SuspenseQuery>
        </ProjectStep>
    );
};

export default EntityEditPage;
