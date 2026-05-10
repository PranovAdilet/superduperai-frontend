"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { Monitor, Smartphone, Square, Tablet, Tv } from "lucide-react";
import type { FC } from "react";
import styles from "./styles.module.scss";

type Props = {
    onClick?: (value: string) => void;
    dense?: boolean;
    active?: string;
    label?: boolean;
};

export const AspectRatios: FC<Props> = ({ onClick, dense, active, label }) => {
    const iconSize = dense ? 20 : 30;
    return (
        <Flex
            direction="column"
            gap="3"
        >
            {label && <Text color="gray">Aspect Ratio</Text>}
            <Flex
                gap="4"
                className={styles.aspectRatios}
            >
                {aspectRatios.map((aspecRatio) => (
                    <Button
                        key={aspecRatio.value}
                        className={clsx(
                            "size-[100px] rounded-xl p-0",
                            {
                                "size-[60px] py-2": dense,
                            },
                            styles.button,
                        )}
                        variant="outline"
                        onClick={() => {
                            onClick?.(aspecRatio.value);
                        }}
                        color={active === aspecRatio.value ? "lime" : "gray"}
                    >
                        <Flex
                            justify="center"
                            align="center"
                            direction="column"
                            gap="2"
                        >
                            <aspecRatio.icon size={iconSize} />
                            <Text>{aspecRatio.value}</Text>
                        </Flex>
                    </Button>
                ))}
            </Flex>
        </Flex>
    );
};

const aspectRatios = [
    { value: "16:9", icon: Monitor },
    { value: "4:3", icon: Tv },
    { value: "1:1", icon: Square },
    { value: "4:5", icon: Tablet },
    { value: "9:16", icon: Smartphone },
];
