"use client";

import { DropdownMenu as DropdownMenuRadix, Text } from "@radix-ui/themes";
import type { FC } from "react";
import styles from "./styles.module.scss";

export type DropdownMenuOption = {
    value: string;
    [key: string]: any;
};

type DropdownMenuProps = {
    trigger?: React.ReactNode;
    options: DropdownMenuOption[];
} & DropdownMenuRadix.ContentProps;

export const DropdownMenu: FC<DropdownMenuProps> = ({
    trigger,
    options,
    ...props
}) => {
    return (
        <DropdownMenuRadix.Root>
            <DropdownMenuRadix.Trigger>{trigger}</DropdownMenuRadix.Trigger>
            <DropdownMenuRadix.Content {...props}>
                {options.map((option) => (
                    <DropdownMenuRadix.Item
                        key={option.value}
                        shortcut={option.shortcut}
                        onClick={() => {
                            if (!option.onClick) return;
                            option.onClick();
                        }}
                        disabled={option.disabled}
                        className={styles.item}
                    >
                        <Text className="max-w-[150px] overflow-hidden whitespace-nowrap">
                            {option.value}
                        </Text>
                    </DropdownMenuRadix.Item>
                ))}
            </DropdownMenuRadix.Content>
        </DropdownMenuRadix.Root>
    );
};
