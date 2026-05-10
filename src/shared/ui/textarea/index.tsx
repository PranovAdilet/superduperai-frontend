"use client";

import type { TextAreaProps } from "@radix-ui/themes";
import { Flex, Text, TextArea as Field } from "@radix-ui/themes";
import type { RefAttributes } from "react";
import { forwardRef } from "react";

type Props = {
    full?: boolean;
    placeholder?: string;
    label?: string;
} & TextAreaProps &
    RefAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
    ({ full, placeholder, label, className, ...rest }, ref) => {
        return (
            <Flex
                direction="column"
                gapY="1"
                width={full ? "100%" : undefined}
                className={className}
            >
                {label && <Text size="2">{label}</Text>}
                <Field
                    placeholder={placeholder}
                    className="size-full grow bg-transparent "
                    ref={ref}
                    {...rest}
                />
            </Flex>
        );
    },
);
