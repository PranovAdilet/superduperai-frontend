"use client";

import { Box, Flex, Tabs as RadixTabs, Spinner } from "@radix-ui/themes";
import type { RootProps } from "@radix-ui/themes/dist/esm/components/tabs.js";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.scss";

type Option<T extends string> = {
    value: T;
    label: string;
};

type Props<T extends string> = {
    options: Option<T>[];
    variant?: "default" | "switch";
    full?: boolean;
    loading?: boolean;
    value: T;
    onValueChange?: (value: T) => void;
} & Omit<RootProps, "onValueChange"> &
    React.RefAttributes<HTMLDivElement>;

export const Tabs = <T extends string>({
    options,
    variant = "default",
    full,
    loading,
    value,
    onValueChange,
    ...props
}: Props<T>) => {
    const handleValueChange = (value: string) => {
        onValueChange?.(value as T);
    };

    return (
        <RadixTabs.Root
            {...props}
            value={value}
            onValueChange={handleValueChange}
        >
            <RadixTabs.List
                size="2"
                className="flex grow justify-center"
            >
                {options.map((option, index) => (
                    <RadixTabs.Trigger
                        disabled={loading}
                        className={clsx({
                            ["flex-1"]: full,
                            [styles.switch]: variant === "switch",
                        })}
                        key={index}
                        value={option.value}
                    >
                        <Flex
                            justify="center"
                            align="center"
                        >
                            <Box
                                position="absolute"
                                className={clsx({
                                    invisible:
                                        option.value !== value || !loading,
                                })}
                            >
                                <Spinner />
                            </Box>
                            <Box
                                className={clsx({
                                    invisible:
                                        option.value === value && loading,
                                })}
                            >
                                {option.label}
                            </Box>
                        </Flex>
                    </RadixTabs.Trigger>
                ))}
            </RadixTabs.List>
        </RadixTabs.Root>
    );
};
