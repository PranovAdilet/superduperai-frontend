import React from "react";
import { Flex, Skeleton } from "@radix-ui/themes";

export const TemplateCardsSkeleton = () => {
    return (
        <Flex
            justify="center"
            wrap="wrap"
            gap="5"
        >
            {[...Array(6)].map((_, index) => (
                <Skeleton
                    key={index}
                    width="240px"
                    height="144px"
                />
            ))}
        </Flex>
    );
};
