"use client";

import { Flex, Text } from "@radix-ui/themes";
import {
    TemplateCardsSkeleton,
    TemplateList,
    useTemplateList,
} from "@/entities/template";
import { SuspenseQuery } from "@/shared/ui";
import type { FC } from "react";

const TemplatesPage: FC = () => {
    const { data, isLoading, isError, refetch } = useTemplateList();

    return (
        <Flex
            justify="center"
            align="center"
            flexGrow="1"
        >
            <Flex
                justify="center"
                align="center"
                direction="column"
                maxWidth="800px"
                gap="5"
                py="3"
            >
                <Text className="text-2xl md:text-3xl">
                    🎞️ It’s time to create a new video
                </Text>

                <SuspenseQuery
                    isLoading={isLoading}
                    isError={isError}
                    refetch={refetch}
                    fallbackLoading={<TemplateCardsSkeleton />}
                >
                    <TemplateList templates={data?.items} />
                </SuspenseQuery>
            </Flex>
        </Flex>
    );
};

export default TemplatesPage;
