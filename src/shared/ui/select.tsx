"use client";

import {
    Box,
    Flex,
    Select as RadixSelect,
    Spinner,
    Text,
} from "@radix-ui/themes";
import type { ReactNode } from "react";
import React, { useMemo } from "react";

type Option<TValue> = {
    value: TValue | null;
    label: string | ReactNode;
};

export type SelectLabelProps = {
    size?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    color?:
        | "gray"
        | "gold"
        | "bronze"
        | "brown"
        | "orange"
        | "tomato"
        | "red"
        | "crimson"
        | "pink"
        | "plum"
        | "purple"
        | "violet"
        | "indigo"
        | "blue"
        | "cyan"
        | "teal"
        | "green"
        | "grass"
        | "lime"
        | "mint"
        | "sky";
    className?: string;
};

type Props<TValue> = {
    label?: string;
    options: Option<TValue>[];
    value: TValue | null;
    onChange?: (value: TValue | null) => void;
    isLoading?: boolean;
    className?: string;
    radius?: "small" | "none" | "medium" | "large" | "full";
    labelProps?: SelectLabelProps;
};

export function Select<TValue>({
    label,
    value,
    onChange,
    options,
    className,
    isLoading,
    radius,
    labelProps,
}: Props<TValue>) {
    const selectedOption = useMemo(() => {
        return options.find((option) => option.value === value);
    }, [options, value]);

    const handleChange = (value: TValue) => {
        if (isLoading) return;
        onChange?.(value === "null" ? null : value);
    };

    return (
        <Flex
            direction="column"
            gap="2"
            className={className}
        >
            {label && (
                <Text
                    size={labelProps?.size ?? "2"}
                    color={labelProps?.color}
                    className={labelProps?.className}
                >
                    {label}
                </Text>
            )}
            <RadixSelect.Root
                value={(value as any) ?? "null"}
                onValueChange={handleChange as any}
            >
                <RadixSelect.Trigger
                    radius={radius}
                    className="w-full px-4 py-5"
                    disabled={isLoading}
                >
                    <Flex
                        justify="between"
                        align="center"
                        gap="2"
                    >
                        <Text>{selectedOption?.label}</Text>
                        <Box
                            width="16px"
                            height="16px"
                        >
                            {isLoading && <Spinner />}
                        </Box>
                    </Flex>
                </RadixSelect.Trigger>
                <RadixSelect.Content>
                    <RadixSelect.Group>
                        {options.map((option) => (
                            <RadixSelect.Item
                                key={option.value as any}
                                value={(option.value as any) ?? "null"}
                            >
                                {option.label}
                            </RadixSelect.Item>
                        ))}
                    </RadixSelect.Group>
                </RadixSelect.Content>
            </RadixSelect.Root>
        </Flex>
    );
}
