"use client";

import type { FC } from "react";
import type { IStyleRead } from "@/shared/api";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Image } from "@/shared/ui";
import styles from "./styles.module.scss";
import clsx from "clsx";

type Props = {
    style: IStyleRead;
    active?: boolean;
    dense?: boolean;
    onClick?: (style: IStyleRead) => void;
};

export const StyleCard: FC<Props> = ({ style, onClick, active, dense }) => {
    const minHeight = dense ? "160px" : "240px";
    return (
        <Flex
            minHeight={minHeight}
            direction="column"
            p="1"
            flexGrow="1"
            className={clsx(styles.card, {
                [styles.active]: active,
            })}
            onClick={() => onClick?.(style)}
        >
            <Image
                className="grow rounded-xl"
                src={style.thumbnail}
                alt={style.name}
            />
            <Box p="2">
                <Text>{style.title}</Text>
            </Box>
        </Flex>
    );
};
