import type { FC } from "react";
import { Flex, Skeleton } from "@radix-ui/themes";
import { CardList } from "@/shared/ui/card-list";

export const EntityCardsSkeleton: FC = () => {
    return (
        <CardList
            direction="row"
            wrap="wrap"
        >
            {Array.from({ length: 8 }).map((_, index) => (
                <CardList.Item key={index}>
                    <Flex
                        minHeight="260px"
                        direction="column"
                        p="1"
                    >
                        <Skeleton
                            className="grow rounded-xl"
                            width="100%"
                        ></Skeleton>
                        <Flex
                            p="2"
                            gap="1"
                            direction="column"
                        >
                            <Skeleton
                                height="24px"
                                width="60%"
                            />
                            <Skeleton
                                height="16px"
                                width="30%"
                            />
                        </Flex>
                    </Flex>
                </CardList.Item>
            ))}
        </CardList>
    );
};
