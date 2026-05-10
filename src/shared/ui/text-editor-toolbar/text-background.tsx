"use client";

import { Flex, Text } from "@radix-ui/themes";
import { ColorPicker } from "../color-picker";
import type { FC } from "react";
import { useEffect, useState } from "react";

type Props = {
    defaultValue: string;
    onChange?: (value: string) => void;
};

export const TextBackground: FC<Props> = ({ defaultValue, onChange }) => {
    const [background, setBackground] = useState(defaultValue);
    const handleChange = (value: string) => {
        setBackground(value);
        onChange?.(value);
    };
    useEffect(() => {
        setBackground(defaultValue);
    }, [defaultValue]);
    return (
        <Flex
            align="center"
            gap="4"
        >
            <Flex gap="3">
                <ColorPicker
                    color={background}
                    onChange={handleChange}
                />
            </Flex>
            <Text>Background</Text>
        </Flex>
    );
};
