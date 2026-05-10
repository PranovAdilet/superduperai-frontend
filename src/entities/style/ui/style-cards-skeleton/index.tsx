import { Box, Flex, Skeleton } from "@radix-ui/themes";
import { CardList } from "@/shared/ui/card-list";
import type { FC } from "react";

type Props = {
    direction?: "row" | "column";
    wrap?: "wrap";
    dense?: boolean;
    size?: string;
    length?: number;
};

export const StyleCardsSkeleton: FC<Props> = ({
    dense,
    direction = "column",
    wrap,
    size,
    length = 8,
}) => {
    const minHeight = dense ? "160px" : "240px";
    return (
        <CardList
            direction={direction}
            wrap={wrap}
        >
            {Array.from({ length }).map((_, index) => (
                <CardList.Item
                    size={size}
                    key={index}
                >
                    <Flex
                        minHeight={minHeight}
                        direction="column"
                        p="1"
                    >
                        <Skeleton
                            className="grow rounded-xl"
                            width="100%"
                        ></Skeleton>
                        <Box p="2">
                            <Skeleton
                                height="24px"
                                width="60%"
                            />
                        </Box>
                    </Flex>
                </CardList.Item>
            ))}
        </CardList>
    );
};
