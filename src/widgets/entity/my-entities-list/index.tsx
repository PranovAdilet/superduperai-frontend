"use client";

import { EntityCard, useEntityList } from "@/entities/entity";
import { useUserMe } from "@/entities/user";
import { EntityCreateDialog } from "@/features/entity";
import { useEntityAddToProject } from "@/features/entity/add-to-project";
import { useEntityRemoveFavorite } from "@/features/entity/remove-favorite";
import { useRouter } from "@/i18n/navigation";
import type { IEntityRead } from "@/shared/api";
import { EntityTypeEnum } from "@/shared/api";
import { getPath } from "@/shared/config/routes";
import { useModal } from "@/shared/store";
import { DropdownMenu, SearchField, SuspenseQuery, Tabs } from "@/shared/ui";
import { DeleteDialog } from "@/shared/ui/delete-dialog";
import { Pagination } from "@/shared/ui/pagination";
import { Button, Flex, Heading, ScrollArea } from "@radix-ui/themes";
import type { FC } from "react";
import { useMemo, useState } from "react";

type Props = {
    projectId?: string;
};

export const MyEntitiesList: FC<Props> = ({ projectId }) => {
    const { open, close } = useModal();

    const { push } = useRouter();

    const { data: user } = useUserMe();

    const entityTypes = [
        { label: "Character", value: EntityTypeEnum.CHARACTER },
        { label: "Object", value: EntityTypeEnum.OBJECT },
        { label: "Location", value: EntityTypeEnum.LOCATION },
    ];

    const [searchText, setSearchText] = useState<string>("");

    const [type, setType] = useState(entityTypes[0].value);

    const [offset, setOffset] = useState(0);

    const limit = 20;

    const { data, isLoading, isError, refetch } = useEntityList({
        userId: user?.id,
        searchText,
        limit,
        offset,
        type,
    });

    const { mutate: addToProject } = useEntityAddToProject();

    const { mutate: removeEntity, isPending: isRemoving } =
        useEntityRemoveFavorite();

    const handleAddToProject = (entity: IEntityRead) => {
        if (!projectId) return;
        addToProject(
            { id: entity.id, projectId },
            {
                onSuccess: () => {
                    push(getPath("PROJECT_VIDEO_EDIT_ENTITIES", { projectId }));
                },
                onError: (err) => {
                    alert(err);
                },
            },
        );
    };

    const handleSearch = (query: string) => {
        setSearchText(query);
        setOffset(0);
    };

    const handleChangeType = (value: EntityTypeEnum) => {
        setType(value);
    };

    const options = useMemo(() => {
        return [
            {
                value: "Generate",
                onClick: () => {
                    open("entityCreateDialog", { type });
                },
                shortcut: "🎨",
            },
            {
                value: "Train LoRa",
                onClick: () => {
                    push(getPath("MY_ENTITY_LORA", { type }));
                },
                shortcut: "✨",
            },
        ];
    }, [type]);

    const handleRemoveEntity = (entity?: IEntityRead) => {
        if (!entity) return;
        removeEntity(
            { id: entity.id },
            {
                onSuccess: () => {
                    close();
                },
            },
        );
    };

    const handleOpenEntityDialog = (entity: IEntityRead) => {
        open("deleteDialog", entity);
    };
    return (
        <>
            <Flex
                pr="3"
                direction="column"
                gap="4"
            >
                <Tabs
                    full
                    options={entityTypes}
                    value={type}
                    onValueChange={handleChangeType}
                />
                <Flex gap="4">
                    <SearchField
                        placeholder="Search entity..."
                        onSearch={handleSearch}
                    />
                    <DropdownMenu
                        options={options}
                        align="end"
                        trigger={
                            <Button className="h-full w-[118px]">
                                Add {type}
                            </Button>
                        }
                    />
                </Flex>
            </Flex>
            <Flex
                flexGrow="1"
                flexBasis="0"
                height="0"
            >
                <ScrollArea scrollbars="vertical">
                    <Flex
                        direction="column"
                        flexGrow="1"
                        height="100%"
                        gap="4"
                        className="pr-3"
                    >
                        <SuspenseQuery
                            isLoading={isLoading}
                            refetch={refetch}
                            isError={isError}
                        >
                            {!data?.items.length ? (
                                <Flex
                                    justify="center"
                                    align="center"
                                >
                                    <Heading size="6">
                                        No entities found
                                    </Heading>
                                </Flex>
                            ) : (
                                data.items.map((entity, index) => (
                                    <EntityCard
                                        key={index}
                                        entity={entity}
                                        href={
                                            !projectId
                                                ? getPath("MY_ENTITY_DETAIL", {
                                                      entityId: entity.id,
                                                  })
                                                : undefined
                                        }
                                        onAddToProject={
                                            projectId
                                                ? handleAddToProject
                                                : undefined
                                        }
                                        onDelete={
                                            !projectId
                                                ? () => {
                                                      handleOpenEntityDialog(
                                                          entity,
                                                      );
                                                  }
                                                : undefined
                                        }
                                    />
                                ))
                            )}
                        </SuspenseQuery>
                    </Flex>
                    <Pagination
                        offset={offset}
                        limit={limit}
                        total={data?.total ?? 0}
                        onChange={setOffset}
                    />
                </ScrollArea>
            </Flex>
            <EntityCreateDialog />
            <DeleteDialog
                onDelete={handleRemoveEntity}
                isPending={isRemoving}
                label="entity"
            />
        </>
    );
};
