import { EntityTypeEnum, type IEntityRead } from "@/shared/api";
import { useModal } from "@/shared/store";
import { Button, Dialog, Flex, ScrollArea } from "@radix-ui/themes";
import { useEffect, useMemo, useState, type FC } from "react";
import { EntityCard, useEntityList } from "../..";
import { QueryCardList, SearchField, Tabs } from "@/shared/ui";
import { Pagination } from "@/shared/ui/pagination";
import { useUserMe } from "@/entities/user";
import { useWindowSize } from "react-use";
import styles from "./styles.module.scss";

type Props = {
    onSelect: (entity: IEntityRead[]) => void;
    onRedirectToCreate?: () => void;
};

export const EntitySelectDialog: FC<Props> = ({
    onSelect,
    onRedirectToCreate,
}) => {
    const { isOpen = true, type: modalType, close } = useModal();
    const isModalOpen = isOpen && modalType === "entitySelectDialog";

    const { data: user } = useUserMe();

    const entityTypes = [
        { label: "Character", value: EntityTypeEnum.CHARACTER },
        { label: "Object", value: EntityTypeEnum.OBJECT },
        { label: "Location", value: EntityTypeEnum.LOCATION },
    ];

    const [searchText, setSearchText] = useState<string>("");
    const [isPublic, setIsPublic] = useState(true);

    const [type, setType] = useState(entityTypes[0].value);

    const [offset, setOffset] = useState(0);

    const limit = 20;

    const { data, isLoading, isError, refetch } = useEntityList({
        userId: user?.id,
        searchText,
        limit,
        offset,
        type,
        _public: isPublic,
    });

    const handleSearch = (query: string) => {
        setSearchText(query);
        setOffset(0);
    };

    const handleChangeType = (value: EntityTypeEnum) => {
        setType(value);
    };

    const [selectedEntity, setSelectedEntity] = useState<IEntityRead[] | null>(
        null,
    );

    const handleSelect = (entity: IEntityRead) => {
        if (!selectedEntity) {
            setSelectedEntity([entity]);
            return;
        }
        if (selectedEntity.some((item) => entity.id === item.id)) {
            setSelectedEntity(
                selectedEntity.filter((item) => item.id !== entity.id),
            );
        } else {
            setSelectedEntity([...selectedEntity, entity]);
        }
    };

    const handleComplete = () => {
        if (!selectedEntity) return;
        onSelect(selectedEntity);
        close();
    };

    useEffect(() => {
        if (isModalOpen) return;
        setSearchText("");
        setOffset(0);
        setSelectedEntity(null);
    }, [isModalOpen]);

    const { width } = useWindowSize();

    const isMobile = useMemo(() => width < 600, [width]);

    return (
        <Dialog.Root
            open={isModalOpen}
            onOpenChange={close}
        >
            <Dialog.Content width="90vw">
                <Dialog.Title size="7">Select entity</Dialog.Title>

                <Flex
                    justify="center"
                    direction="column"
                    gap="4"
                    mt="4"
                >
                    <Flex
                        flexGrow="1"
                        justify="center"
                        p="6"
                    >
                        <Flex
                            maxWidth="700px"
                            direction="column"
                            gap="5"
                            flexGrow="1"
                        >
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
                                    <Flex
                                        align="center"
                                        gap="3"
                                    >
                                        <label htmlFor="public">Public</label>
                                        <input
                                            className="size-4"
                                            type="checkbox"
                                            id="public"
                                            checked={isPublic}
                                            onChange={() => {
                                                setIsPublic(!isPublic);
                                            }}
                                        />
                                    </Flex>
                                </Flex>
                            </Flex>
                            <ScrollArea
                                className="h-[40vh]"
                                scrollbars="vertical"
                            >
                                <Flex
                                    flexGrow="1"
                                    height="100%"
                                    gap="4"
                                >
                                    <QueryCardList
                                        isLoading={isLoading}
                                        refetch={refetch}
                                        isError={isError}
                                        items={data?.items}
                                        itemSize={isMobile ? "45%" : "31%"}
                                        wrap="wrap"
                                        direction="row"
                                    >
                                        {(entity) => (
                                            <EntityCard
                                                entity={entity}
                                                active={selectedEntity?.some(
                                                    (item) =>
                                                        entity.id === item.id,
                                                )}
                                                onClick={() => {
                                                    handleSelect(entity);
                                                }}
                                            />
                                        )}
                                    </QueryCardList>
                                </Flex>
                                <Pagination
                                    offset={offset}
                                    limit={limit}
                                    total={data?.total ?? 0}
                                    onChange={setOffset}
                                />
                            </ScrollArea>
                        </Flex>
                    </Flex>
                    <Flex
                        justify="between"
                        className={styles.buttons}
                        gap="3"
                    >
                        {onRedirectToCreate ? (
                            <Button
                                size={isMobile ? "2" : "3"}
                                onClick={onRedirectToCreate}
                            >
                                Create entity
                            </Button>
                        ) : (
                            <Flex></Flex>
                        )}
                        <Flex
                            justify="end"
                            gap="2"
                        >
                            <Button
                                color="gray"
                                size={isMobile ? "2" : "3"}
                                onClick={close}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="lime"
                                size={isMobile ? "2" : "3"}
                                disabled={!selectedEntity?.length}
                                onClick={handleComplete}
                            >
                                Select {selectedEntity?.length}
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
