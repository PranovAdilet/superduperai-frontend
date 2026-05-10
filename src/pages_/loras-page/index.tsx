"use client";

import { useLoraList } from "@/entities/lora";
import { useUserMe } from "@/entities/user";
import { useRouter } from "@/i18n/navigation";
import { ListOrderEnum, LoraStatusEnum } from "@/shared/api";
import { getPath } from "@/shared/config/routes";
import { Link, SearchField, SuspenseQuery } from "@/shared/ui";
import { Pagination } from "@/shared/ui/pagination";
import {
    Badge,
    Button,
    Callout,
    Card,
    Flex,
    Heading,
    ScrollArea,
    Text,
} from "@radix-ui/themes";
import { Info } from "lucide-react";
import { useState } from "react";

export const LorasPage = () => {
    const { push } = useRouter();

    const { data: user, isSuccess, isLoading: isUserLoading } = useUserMe();

    const [searchText, setSearchText] = useState<string>("");

    const [offset, setOffset] = useState(0);

    const limit = 10;

    const {
        data,
        isLoading: isProjectsLoading,
        isError,
        refetch,
    } = useLoraList(
        {
            userId: user?.id,
            orderBy: "created_at",
            order: ListOrderEnum.DESCENDENT,
            searchText,
            limit,
            offset,
        },
        { enabled: isSuccess },
    );

    const handleAdd = () => {
        push(getPath("LORA_CREATE"));
    };

    const colorsMap: Record<LoraStatusEnum, "red" | "blue" | "lime"> = {
        [LoraStatusEnum.CANCELED]: "red",
        [LoraStatusEnum.PENDING]: "blue",
        [LoraStatusEnum.COMPLETED]: "lime",
    };

    return (
        <Flex
            flexGrow="1"
            justify="center"
            p="6"
        >
            <Flex
                maxWidth="700px"
                direction="column"
                gap="5"
                flexGrow="1"
            >
                <Callout.Root>
                    <Callout.Icon>
                        <Info />
                    </Callout.Icon>
                    <Callout.Text>
                        <Heading size="4">
                            Train: Personalized Character and Style Creation
                        </Heading>
                        <p>
                            Make your character truly yours! Create consistent
                            and recognizable styles or unique avatars that match
                            your vision.
                        </p>
                        <ul>
                            <li>
                                Price: <strong>50</strong> credits.
                            </li>
                            <li>
                                Delivery: Within <strong>1-2</strong> business
                                day.
                            </li>
                        </ul>
                        <Link
                            target="_blank"
                            href="https://docs.google.com/presentation/d/1BjqJSKVXkf3cMwxwMc-3eqvkmkAz5ZoeoeSSBOI64J0/edit?usp=sharing"
                        >
                            Example
                        </Link>
                    </Callout.Text>
                </Callout.Root>
                <Flex
                    pr="3"
                    gap="4"
                >
                    <SearchField
                        placeholder="Search LoRa..."
                        onSearch={setSearchText}
                    />
                    <Button
                        className="h-full"
                        onClick={handleAdd}
                    >
                        Add new
                    </Button>
                </Flex>
                <Flex
                    flexGrow="1"
                    flexBasis="0"
                    height="0"
                >
                    <ScrollArea scrollbars="vertical">
                        <Flex
                            direction="column"
                            flexGrow="1"
                            height="100%"
                            gap="4"
                            className="pr-3"
                        >
                            <SuspenseQuery
                                isLoading={isProjectsLoading || isUserLoading}
                                refetch={refetch}
                                isError={isError}
                            >
                                {!data?.items.length ? (
                                    <Flex
                                        justify="center"
                                        align="center"
                                    >
                                        <Heading size="6">
                                            No LoRa found
                                        </Heading>
                                    </Flex>
                                ) : (
                                    data.items.map((lora) => (
                                        <Card key={lora.id}>
                                            <Flex justify="between">
                                                <Flex direction="column">
                                                    <Text>{lora.name}</Text>
                                                    <Text
                                                        size="2"
                                                        color="gray"
                                                    >
                                                        {lora.trigger}
                                                    </Text>
                                                </Flex>
                                                <Badge
                                                    color={
                                                        colorsMap[lora.status]
                                                    }
                                                    className="capitalize"
                                                >
                                                    {lora.status}
                                                </Badge>
                                            </Flex>
                                        </Card>
                                    ))
                                )}
                            </SuspenseQuery>
                        </Flex>
                        <Pagination
                            offset={offset}
                            limit={limit}
                            total={data?.total ?? 0}
                            onChange={setOffset}
                        />
                    </ScrollArea>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default LorasPage;
