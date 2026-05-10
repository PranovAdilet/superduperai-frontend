"use client";

import { PaymentTypeEnum } from "@/shared/api";
import { Flex, Heading, Text } from "@radix-ui/themes";
import clsx from "clsx";
import type { FC } from "react";

type Props = {
    type: PaymentTypeEnum;
};

export const PaymentPackageCard: FC<Props> = ({ type }) => {
    const data = object[type];
    return (
        <Flex
            width="400px"
            direction="column"
            gap="2"
            px="6"
            py="3"
            className={clsx("rounded-xl border ", {
                [" border-lime-500"]: type === PaymentTypeEnum.PRO,
            })}
        >
            <Heading size="3"> {data.title}</Heading>
            <Flex direction="column">
                {data.package.map((item, index) => (
                    <Text
                        size="2"
                        key={index}
                    >
                        {item}
                    </Text>
                ))}
            </Flex>
        </Flex>
    );
};

const basePackage = [
    "💸 100 free credits per month",
    "🛠️ Access to basic editing tools only",
    "🎭 Limited animation and voiceover options",
    "🚫 Videos with watermarks",
];

const premiumPackage = [
    "🔧 Full access to all editing tools",
    "🚀 Unlimited creation",
    "💎 Download finished videos without watermarks",
    "🤝 Personal manager to assist with your projects",
    "📚 Exclusive training sessions to boost your skills",
];

const object = {
    [PaymentTypeEnum.BASE]: {
        title: "🐾 Without a Package:",
        package: basePackage,
    },
    [PaymentTypeEnum.PRO]: {
        title: "⚡ With a Power Package:",
        package: premiumPackage,
    },
};
