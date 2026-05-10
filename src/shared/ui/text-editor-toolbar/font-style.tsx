"use client";

import { ToggleGroup } from "../toggle-group";
import {
    ArrowUpZA,
    Bold,
    Italic,
    Strikethrough,
    Underline,
} from "lucide-react";
import type { FC } from "react";
import { useEffect, useState } from "react";

type Props = {
    defaultValue: string[];
    onChange?: (style: string) => void;
};

export const FontStyles: FC<Props> = ({ defaultValue, onChange }) => {
    const [textStyle, setTextStyle] = useState(defaultValue);

    useEffect(() => {
        setTextStyle(defaultValue);
    }, [defaultValue]);

    const handleChange = (values: string[]) => {
        const addedStyles = values.filter(
            (value) => !textStyle.includes(value),
        );
        const removedStyles = textStyle.filter(
            (value) => !values.includes(value),
        );

        const changedValue =
            addedStyles.length > 0 ? addedStyles[0] : removedStyles[0];

        setTextStyle(values);
        onChange?.(changedValue);
    };

    return (
        <ToggleGroup
            items={items}
            value={textStyle}
            type="multiple"
            onValueChange={handleChange}
            defaultValue={textStyle}
        />
    );
};

const items = [
    {
        label: "Bold",
        icon: <Bold />,
        value: "bold",
    },
    {
        label: "Italic",
        icon: <Italic />,
        value: "italic",
    },
    {
        label: "Underline",
        icon: <Underline />,
        value: "underline",
    },
    {
        label: "Strikethrough",
        icon: <Strikethrough />,
        value: "linethrough",
    },
    {
        label: "AllCaps",
        icon: <ArrowUpZA />,
        value: "uppercase",
    },
];
