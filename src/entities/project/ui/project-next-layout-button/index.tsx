"use clint";

import { Button, Flex } from "@radix-ui/themes";
import type { FC, ReactNode } from "react";

type Props = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    title: string;
    children?: ReactNode;
    isVisible?: boolean;
    loading?: boolean;
};

export const ProjectNextLayoutButton: FC<Props> = ({
    onClick,
    title,
    children,
    isVisible,
    loading,
}) => {
    return (
        <Flex
            direction="column"
            gap="4"
            px="3"
        >
            {children}
            {isVisible && (
                <Button
                    loading={loading}
                    onClick={onClick}
                >
                    {title}
                </Button>
            )}
        </Flex>
    );
};
