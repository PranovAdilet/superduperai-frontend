"use client";

import { PaymentButton } from "@/features/stripe";
import { PaymentTypeEnum } from "@/shared/api";
import { Link, PaymentPackageCard } from "@/shared/ui";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

export const PaymentPage = () => {
    const t = useTranslations("metadata");
    return (
        <Flex
            align="center"
            flexGrow="1"
            direction="column"
            p="4"
        >
            <Flex
                maxWidth="700px"
                align="center"
                flexGrow="1"
                direction="column"
                gap="4"
            >
                <Heading size="7">Welcome to {t("title")}</Heading>
                <Text as="p">
                    🎉 First-time users get 100 credits for free, with full
                    access to our editor`s features!
                </Text>

                <PaymentPackageCard type={PaymentTypeEnum.BASE} />
                <PaymentPackageCard type={PaymentTypeEnum.PRO} />

                <Flex
                    direction="column"
                    gap="4"
                    width="400px"
                >
                    <PaymentButton
                        type={PaymentTypeEnum.BASE}
                        title="BASE - 100 credits"
                        description="5-10 projects"
                        price="$20"
                    />
                    <PaymentButton
                        type={PaymentTypeEnum.PRO}
                        title="PRO - 1000 credits"
                        description="20-50 projects"
                        price="$100"
                    />
                </Flex>

                <Link href="https://superduperai.co/privacy">
                    <Text
                        color="gray"
                        size="2"
                    >
                        Privacy policy
                    </Text>
                </Link>
            </Flex>
        </Flex>
    );
};

export default PaymentPage;
