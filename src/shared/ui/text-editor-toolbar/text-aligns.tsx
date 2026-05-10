"use client";

import { ToggleGroup } from "../toggle-group";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import type { FC } from "react";
import { useEffect, useState } from "react";

type Props = {
    defaultValue: string;
    onChange?: (align: string) => void;
};

export const TextAligns: FC<Props> = ({ defaultValue, onChange }) => {
    const [align, setAlign] = useState(defaultValue);

    const handleChange = (value: string) => {
        setAlign(value);
        onChange?.(value);
    };

    useEffect(() => {
        setAlign(defaultValue);
    }, [defaultValue]);
    return (
        <ToggleGroup
            items={items}
            type="single"
            defaultValue={align}
            value={align}
            onValueChange={handleChange}
        />
    );
};

const items = [
    {
        value: "left",
        label: "Left aligned",
        icon: <AlignLeft />,
    },
    {
        value: "center",
        label: "Center aligned",
        icon: <AlignCenter />,
    },
    {
        value: "right",
        label: "Right aligned",
        icon: <AlignRight />,
    },
];
