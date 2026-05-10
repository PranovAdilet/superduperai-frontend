"use client";

import { Flex, Skeleton } from "@radix-ui/themes";
import type { FC } from "react";

type Props = {
    dense?: boolean;
};

export const ScenesSkeletonCards: FC<Props> = ({ dense = false }) => {
    const height = dense ? "100px" : "170px";
    return (
        <Flex
            direction="column"
            gap="5"
            p="3"
            flexGrow="1"
        >
            {[...Array(6)].map((_, index) => (
                <Flex
                    key={index}
                    className="scroll-my-3"
                    flexGrow="1"
                    gap="4"
                >
                    <Flex align="center">
                        <Skeleton
                            key={index}
                            width="20px"
                            height="35px"
                        />
                    </Flex>
                    <Flex width="33%">
                        <Skeleton
                            width={"100%"}
                            key={index}
                            height={height}
                            className="rounded-lg"
                        />
                    </Flex>
                    <Flex
                        flexGrow="1"
                        direction="column"
                        gap="2"
                    >
                        <Skeleton height="16px" />
                        <Skeleton
                            height="16px"
                            width="90%"
                        />
                        <Skeleton
                            height="16px"
                            width="98%"
                        />
                        <Skeleton
                            height="16px"
                            width="70%"
                        />
                    </Flex>
                </Flex>
            ))}
        </Flex>
    );
};
