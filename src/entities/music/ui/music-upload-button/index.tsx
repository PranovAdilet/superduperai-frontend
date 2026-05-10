"use client";

import { Flex, Spinner, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { Upload } from "lucide-react";
import type { FC } from "react";

type Props = {
    onClick: () => void;
    isPending?: boolean;
};

export const MusicUploadButton: FC<Props> = ({ onClick, isPending }) => {
    return (
        <>
            <Flex
                justify="between"
                align="center"
                gapX="4"
                py="3"
                px="5"
                className={clsx(
                    "rounded-lg border border-dashed border-gray-600",
                    {
                        "opacity-55": isPending,
                    },
                )}
                position="relative"
                role="button"
                onClick={onClick}
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
                    align="center"
                    gap="3"
                >
                    <Flex
                        width="70px"
                        height="70px"
                        flexShrink="0"
                        justify="center"
                        align="center"
                    >
                        <Upload size="30px" />
                    </Flex>
                    <Flex
                        direction="column"
                        align="start"
                        gapY="1"
                    >
                        <Text
                            as="p"
                            size="4"
                        >
                            Click here to upload your own music
                        </Text>
                        <Text
                            as="p"
                            size="2"
                            color="gray"
                            className="opacity-90"
                        ></Text>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
};
