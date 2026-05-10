"use client";

import type { IEntityRead } from "@/shared/api";
import { EntityTypeEnum } from "@/shared/api";
import { useModal } from "@/shared/store";
import { Image } from "@/shared/ui";
import { Button, Flex, Text } from "@radix-ui/themes";
import { PlusCircle, X } from "lucide-react";
import { memo, type FC } from "react";

type Props = {
    entities: IEntityRead[];
    setEntities: (entity: IEntityRead[]) => void;
    showEntities?: boolean;
    setEntity?: (entity: IEntityRead) => void;
};

const EntitySelectComponent: FC<Props> = ({
    setEntities,
    entities,
    showEntities = true,
    setEntity,
}) => {
    const { open } = useModal();

    const handleAddEntity = () => {
        open("entitySelectDialog");
    };

    const handleRemoveEntity = (id: string) => {
        setEntities(entities.filter((entity) => entity.id !== id));
    };

    // const entityColorMap: Record<EntityTypeEnum, "lime" | "bronze" | "cyan"> = {
    //     [EntityTypeEnum.CHARACTER]: "lime",
    //     [EntityTypeEnum.OBJECT]: "bronze",
    //     [EntityTypeEnum.LOCATION]: "cyan",
    //     [EntityTypeEnum.PLACE]: "cyan",
    // };

    const entityColorMap: Record<EntityTypeEnum, "lime" | "gold" | "cyan"> = {
        [EntityTypeEnum.CHARACTER]: "lime",
        [EntityTypeEnum.OBJECT]: "gold",
        [EntityTypeEnum.LOCATION]: "cyan",
        [EntityTypeEnum.PLACE]: "cyan",
    };

    return (
        <Flex
            align="center"
            className="px-6"
            position="absolute"
            bottom="24px"
            left="0"
            gap="2"
        >
            <Button
                size="1"
                variant="outline"
                onClick={handleAddEntity}
            >
                <PlusCircle size="16px" />
                Add entity
            </Button>
            {showEntities &&
                entities.map((entity) => (
                    <Flex
                        key={entity.id}
                        gap="2"
                        align="center"
                        justify="between"
                        className="rounded-lg"
                        style={{
                            backgroundColor: entityColorMap[entity.type],
                        }}
                    >
                        <Flex
                            gap="2"
                            align="center"
                            onClick={() => setEntity?.(entity)}
                            role="button"
                            maxWidth="70px"
                            height="20px"
                        >
                            {entity.file?.url && (
                                <Image
                                    src={entity.file.url}
                                    width="25px"
                                    height="100%"
                                    className="shrink-0"
                                />
                            )}
                            <Text
                                className="line-clamp-1  text-[12px] text-black"
                                weight="medium"
                            >
                                {entity.name}
                            </Text>
                        </Flex>
                        <button
                            onClick={() => {
                                handleRemoveEntity(entity.id);
                            }}
                        >
                            <X
                                size="16px"
                                color="black"
                            />
                        </button>
                    </Flex>
                ))}
        </Flex>
    );
};

export const EntitySelectLayout = memo(EntitySelectComponent);
