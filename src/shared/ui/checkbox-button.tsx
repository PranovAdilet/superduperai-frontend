"use client";

import { Flex, Spinner } from "@radix-ui/themes";
import { Circle, CircleCheck } from "lucide-react";
import type { FC } from "react";

type Props = {
    isLoading?: boolean;
    isActive?: boolean;
    onClick?: () => void;
};
export const CheckboxButton: FC<Props> = ({ isLoading, isActive, onClick }) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onClick?.();
    };
    return (
        <Flex
            onClick={handleClick}
            flexGrow="1"
            justify="center"
            align="center"
            role="button"
            width="28px"
            height="28px"
        >
            {isLoading ? (
                <Flex className="rounded-full  bg-lime-500 p-1">
                    <Spinner className="text-black" />
                </Flex>
            ) : isActive ? (
                <CircleCheck
                    className="fill-lime-500"
                    color="black"
                    size="28px"
                />
            ) : (
                <Circle
                    fill="black"
                    className="text-lime-500"
                    size="24px"
                />
            )}
        </Flex>
    );
};
