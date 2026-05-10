"use client";

import { Flex } from "@radix-ui/themes";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import { ALargeSmall } from "lucide-react";
import { TextField } from "../text-field";

type Props = {
    defaultValue: number;
    onChange?: (value: number) => void;
};

export const TextFontSize: FC<Props> = ({ defaultValue, onChange }) => {
    const [fontSize, setFontSize] = useState(defaultValue);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFontSize(+value);
        onChange?.(+value);
    };

    useEffect(() => {
        setFontSize(defaultValue);
    }, [defaultValue]);
    return (
        <Flex gap="3">
            <TextField
                full
                value={fontSize}
                slot={<ALargeSmall />}
                type="number"
                onChange={handleChange}
            />
        </Flex>
    );
};
