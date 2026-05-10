import type { FC } from "react";
import { Flex, Skeleton } from "@radix-ui/themes";
import { CardList } from "@/shared/ui/card-list";

type Props = {
    direction?: "row" | "column";
    wrap?: "wrap" | "nowrap" | "wrap-reverse";
    size?: string;
};

export const FileCardsSkeleton: FC<Props> = ({ direction, wrap, size }) => {
    return (
        <CardList
            direction={direction}
            wrap={wrap}
        >
            {Array.from({ length: 8 }).map((_, index) => (
                <CardList.Item
                    key={index}
                    size={size}
                >
                    <Flex
                        direction="column"
                        height="100%"
                        minHeight="150px"
                        p="1"
                    >
                        <Skeleton
                            className="grow rounded-xl"
                            width="100%"
                        ></Skeleton>
                    </Flex>
                </CardList.Item>
            ))}
        </CardList>
    );
};
