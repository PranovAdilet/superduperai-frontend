import React from "react";
import * as ToggleGroupRadix from "@radix-ui/react-toggle-group";
import "./styles.css";

type RootProps = React.ComponentProps<typeof ToggleGroupRadix.Root>;

type ToggleGroupItem = {
    value: string;
    label: string;
    icon?: React.ReactNode;
};

type ToggleGroupProps = {
    items: ToggleGroupItem[];
    ariaLabel?: string;
    type?: "single" | "multiple";
} & RootProps;

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
    items,
    ariaLabel = "Toggle Group",
    ...props
}) => (
    <ToggleGroupRadix.Root
        className="ToggleGroup"
        aria-label={ariaLabel}
        {...props}
    >
        {items.map((item) => (
            <ToggleGroupRadix.Item
                key={item.value}
                className="ToggleGroupItem"
                value={item.value}
                aria-label={item.label}
            >
                {item.icon}
            </ToggleGroupRadix.Item>
        ))}
    </ToggleGroupRadix.Root>
);
