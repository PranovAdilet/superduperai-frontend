"use client";

import { QueryCardList } from "@/shared/ui";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { StyleCard } from "../style-card";
import type { IStyleRead } from "@/shared/api";
import { StyleCardsSkeleton } from "../style-cards-skeleton";
import type { FC, RefObject } from "react";

type Props = {
    items?: IStyleRead[];
    isError: boolean;
    isLoading: boolean;
    refetch: any;
    heading: string;
    selectedStyle: string | null;
    activeRef: RefObject<HTMLDivElement>;
    onSelect: (style: IStyleRead) => void;

    skeletonLength?: number;
};

export const StyleQueryList: FC<Props> = ({
    isError,
    isLoading,
    items,
    refetch,
    heading,
    selectedStyle,
    activeRef,
    onSelect,
    skeletonLength = 8,
}) => {
    return (
        <Flex
            direction="column"
            gap="3"
        >
            <Heading>
                {heading}{" "}
                <Text
                    color="gray"
                    className=" opacity-50"
                >
                    {items?.length}
                </Text>
            </Heading>
            <QueryCardList
                items={items}
                isError={isError}
                isLoading={isLoading}
                refetch={refetch}
                placeholder={<span></span>}
                fallbackLoading={
                    <StyleCardsSkeleton
                        direction="row"
                        wrap="wrap"
                        size="230px"
                        length={skeletonLength}
                    />
                }
                itemSize="230px"
                direction="row"
                wrap="wrap"
            >
                {(style) => (
                    <Flex
                        className="size-full"
                        ref={
                            selectedStyle === style.name ? activeRef : undefined
                        }
                    >
                        <StyleCard
                            style={style}
                            active={selectedStyle === style.name}
                            onClick={onSelect}
                        />
                    </Flex>
                )}
            </QueryCardList>
        </Flex>
    );
};
