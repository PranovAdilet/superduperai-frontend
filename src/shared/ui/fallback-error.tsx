import type { FC } from "react";
import React from "react";
import { Button, Flex, Text } from "@radix-ui/themes";

type FallbackErrorProps = {
    refetch: () => void;
};

export const ErrorQuery: FC<FallbackErrorProps> = ({ refetch }) => {
    return (
        <Flex
            direction="column"
            justify="center"
            align="center"
            gap="16px"
            width="100%"
            height="100%"
        >
            <Text>Something went wrong</Text>
            <Button onClick={refetch}>Try again</Button>
        </Flex>
    );
};
