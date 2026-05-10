"use client";

import { Flex, Text } from "@radix-ui/themes";
import { ColorPicker } from "../color-picker";
import type { FC } from "react";
import { useEffect, useState } from "react";

type Props = {
    defaultValue: string;
    onChange?: (value: string) => void;
};

export const TextColor: FC<Props> = ({ defaultValue, onChange }) => {
    const [color, setColor] = useState(defaultValue);
    const handleChange = (newColor: string) => {
        setColor(newColor);
        onChange?.(newColor);
    };

    useEffect(() => {
        setColor(defaultValue);
    }, [defaultValue]);

    return (
        <Flex
            align="center"
            gap="4"
        >
            <Flex gap="3">
                <ColorPicker
                    color={color}
                    onChange={handleChange}
                />
            </Flex>
            <Text>Color</Text>
        </Flex>
    );
};
