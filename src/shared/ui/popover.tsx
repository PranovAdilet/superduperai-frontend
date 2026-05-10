"use client";
import { Popover as PopoverRadix } from "@radix-ui/themes";

type PopoverProps = {
    trigger?: React.ReactNode;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    contentClassName?: string;
} & PopoverRadix.RootProps;

export const Popover = ({
    trigger,
    children,
    side,
    contentClassName,
    ...props
}: PopoverProps) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    };
    return (
        <PopoverRadix.Root {...props}>
            {trigger && (
                <PopoverRadix.Trigger onClick={handleClick}>
                    {trigger}
                </PopoverRadix.Trigger>
            )}
            <PopoverRadix.Content
                maxHeight="250px"
                side={side}
                className={contentClassName}
            >
                {children}
            </PopoverRadix.Content>
        </PopoverRadix.Root>
    );
};
