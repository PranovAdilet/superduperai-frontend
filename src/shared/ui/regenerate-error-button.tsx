"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import type { FC } from "react";

type Props = {
    isPending?: boolean;
    onRegenerate?: () => void;
};

export const RegenerateErrorButton: FC<Props> = ({
    isPending,
    onRegenerate,
}) => {
    return (
        <Flex
            width="100%"
            align="center"
            justify="center"
            direction="column"
            gap="4"
        >
            <Text color="gray">
                Something went wrong, please try to regenerate 🥲
            </Text>
            <Button
                variant="classic"
                color="gray"
                size="2"
                onClick={onRegenerate}
                loading={isPending}
            >
                Regenerate
            </Button>
        </Flex>
    );
};
