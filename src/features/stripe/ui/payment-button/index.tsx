"use client";

import { Box, Card, Flex, Spinner, Text } from "@radix-ui/themes";
import { usePaymentLink } from "../../payment-link";
import { PaymentTypeEnum } from "@/shared/api";
import type { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

type Props = {
    type: PaymentTypeEnum;
    title?: string;
    price?: string;
    description?: string;
};

export const PaymentButton: FC<Props> = ({
    type,
    description,
    price,
    title,
}) => {
    const { mutate, isPending } = usePaymentLink();

    const handleBuy = () => {
        mutate(
            { type },
            {
                onSuccess(data) {
                    window.location.href = data;
                },
            },
        );
    };
    return (
        <Card
            onClick={handleBuy}
            className={clsx(styles.card, {
                [styles.active]: type === PaymentTypeEnum.PRO,
                "opacity-55": isPending,
            })}
        >
            {isPending && (
                <Flex
                    position="absolute"
                    top="50%"
                    left="50%"
                    className="-translate-x-1/2 -translate-y-1/2"
                    justify="center"
                    align="center"
                    flexGrow="1"
                >
                    <Spinner size="3" />
                </Flex>
            )}

            <Flex
                justify="between"
                align="end"
                flexGrow="1"
            >
                <Box>
                    <Text as="p">{title} </Text>
                    <Flex gap="2">
                        <Text
                            as="p"
                            color="lime"
                        >
                            {price}
                        </Text>
                        {type === PaymentTypeEnum.PRO && (
                            <Text
                                as="p"
                                color="gray"
                            >
                                (save 50%)
                            </Text>
                        )}
                    </Flex>
                </Box>
                <Flex>
                    <Text
                        size="2"
                        color="gray"
                    >
                        {description}
                    </Text>
                </Flex>
            </Flex>

            <Box
                position="absolute"
                top="-5px"
                right="-4px"
                className="rounded-lg bg-lime-500 text-black"
                p="1"
                px="6"
                pr="7"
                role="button"
            >
                <Text
                    size="2"
                    weight="bold"
                >
                    Buy
                </Text>
            </Box>
        </Card>
    );
};
