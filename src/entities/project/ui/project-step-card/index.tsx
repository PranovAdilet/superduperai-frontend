"use client";
import { Box, Card, Flex, Skeleton, Spinner, Text } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import type { FC, ReactNode } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Image, Link, Video } from "@/shared/ui";
import { FileTypeEnum } from "@/shared/api";

export type ItemProps = {
    href?: string;
    thumbnail?: string;
    title?: string;
    subtitle?: string;
    disabled?: boolean;
    type?: FileTypeEnum;
};

const Item: FC<ItemProps> = ({
    // href,
    thumbnail,
    title,
    subtitle,
    // disabled,
    type,
}) => (
    <Card asChild>
        {/* <Link
            href={href}
            color="gray"
            disabled={disabled}
            className="p-0"
            size="3"
        > */}
        <Flex
            flexGrow="1"
            display="flex"
            justify="between"
            align="center"
            gap="4"
            p="3"
            pr="6"
        >
            <Flex
                align="center"
                gap="3"
            >
                <Box
                    width="60px"
                    height="60px"
                >
                    {type === FileTypeEnum.VIDEO ? (
                        <Video
                            src={thumbnail}
                            className="rounded-full"
                        />
                    ) : (
                        <Image
                            src={thumbnail}
                            imageClassName="rounded-full"
                        />
                    )}
                </Box>
                <Box
                    flexGrow="1"
                    flexBasis="0"
                >
                    <Text
                        weight="medium"
                        className="line-clamp-1"
                    >
                        {title}
                    </Text>
                    <Text as="p">{subtitle}</Text>
                </Box>
            </Flex>
            {/* {href && (
                    <Text
                        color="lime"
                        as="div"
                    >
                        Edit
                    </Text>
                )} */}
        </Flex>
        {/* </Link> */}
    </Card>
);

export type Props = {
    children?: ReactNode;
    actionBtn?: ReactNode;
    footer?: ReactNode;
    isVisible?: boolean;
    isGeneration?: boolean;
    generationTime?: string;
    hasTransition?: boolean;
    loadingFallback?: ReactNode;
    loading?: boolean;
    disabled?: boolean;
    onAdd?: () => void;
    title: string;
    active?: boolean;
    id?: string;
    route?: string;
};

const ProjectStepCard: FC<Props> & { Item: FC<ItemProps> } = ({
    children,
    onAdd,
    title,
    actionBtn,
    active,
    footer,
    loading,
    disabled,
    loadingFallback,
    hasTransition = false,
    isVisible = true,
    isGeneration = false,
    generationTime = "1-2 minutes",
    route,
    id,
}: Props) => {
    return (
        <Card
            className={clsx("py-4", {
                [styles.active]: active,
            })}
            id={id}
        >
            <Link
                className={styles.link}
                underline="none"
                href={route}
                disabled={disabled}
            >
                <Flex
                    gap={actionBtn || isVisible ? "4" : "0"}
                    // gap="4"
                    direction="column"
                >
                    <Flex
                        align="center"
                        justify="between"
                        width="100%"
                        px="3"
                    >
                        <Text
                            as="p"
                            weight="medium"
                        >
                            {title}
                        </Text>
                        {isVisible ? (
                            (actionBtn ??
                            (onAdd && (
                                <button onClick={onAdd}>
                                    <PlusIcon size="18px" />
                                </button>
                            )))
                        ) : (
                            <Text
                                size="2"
                                color="gray"
                            >
                                NOT READY
                            </Text>
                        )}
                    </Flex>
                    {children && (
                        <Flex
                            direction="column"
                            gap="4"
                            overflow="hidden"
                            style={{
                                maxHeight: isVisible ? "400px" : "0",
                                transition: hasTransition
                                    ? "max-height 2s ease-in-out"
                                    : "none",
                            }}
                        >
                            {loading
                                ? (loadingFallback ?? (
                                      <Skeleton
                                          className="rounded-xl"
                                          height="84px"
                                      />
                                  ))
                                : children}
                        </Flex>
                    )}
                    {isGeneration && (
                        <Flex
                            justify="center"
                            align="center"
                            gap="2"
                            px="3"
                            py="2"
                            className="rounded-b-xl"
                        >
                            <Spinner />
                            <Text
                                color="gray"
                                size="2"
                            >
                                Generating... {generationTime}
                            </Text>
                        </Flex>
                    )}
                    {footer && (
                        <Flex
                            justify="end"
                            px="3"
                            overflow="hidden"
                            style={{
                                maxHeight: isVisible ? "60px" : "0",
                                transition: hasTransition
                                    ? "max-height 1s ease-in-out"
                                    : "none",
                            }}
                        >
                            {footer}
                        </Flex>
                    )}
                </Flex>
            </Link>
        </Card>
    );
};

ProjectStepCard.Item = Item;

export { ProjectStepCard };
