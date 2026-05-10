"use client";

import { Flex } from "@radix-ui/themes";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";

type Props = {} & PropsWithChildren & HTMLAttributes<HTMLFormElement>;

export const Form: FC<Props> = ({ children, ...rest }) => {
    return (
        <form {...rest}>
            <Flex
                direction="column"
                gapY="4"
            >
                {children}
            </Flex>
        </form>
    );
};
