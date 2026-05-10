"use client";

import { Flex, Text, TextField as Field } from "@radix-ui/themes";
import type { ReactNode, RefAttributes } from "react";
import { forwardRef } from "react";

type FieldProps = Omit<Field.RootProps, "slot">;

type Props = {
    full?: boolean;
    placeholder?: string;
    label?: string;
    slot?: ReactNode;
} & FieldProps &
    RefAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, Props>(
    ({ full, placeholder, label, slot, ...rest }, ref) => {
        return (
            <Flex
                direction="column"
                gapY="1"
                width={full ? "100%" : undefined}
            >
                {label && <Text size="2">{label}</Text>}
                <Field.Root
                    placeholder={placeholder}
                    className="w-full bg-transparent"
                    size="3"
                    ref={ref}
                    {...rest}
                >
                    {slot && <Field.Slot>{slot}</Field.Slot>}
                </Field.Root>
            </Flex>
        );
    },
);
