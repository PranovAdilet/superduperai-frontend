"use client";

import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import { Menu } from "lucide-react";
import type { FC } from "react";
import { Popover } from "@/shared/ui";
import React, { useState } from "react";

type Props = {
    projectId: string;
};

export const ProjectActionsList: FC<Props> = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        // deleteProject(
        //     { id: projectId },
        //     {
        //         onSuccess: () => {
        //             setIsOpen(false);
        //         },
        //     },
        // );
    };

    const actionsList = [
        {
            title: "Delete",
            onClick: handleDelete,
            // isPending: isDeleting,
            isPending: true,
        },
    ];

    const handleParentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <Box
            position="absolute"
            top="6px"
            right="6px"
            className="z-10 rounded-sm bg-black/50"
            onClick={handleParentClick}
        >
            <Popover
                trigger={<Menu />}
                side="right"
                contentClassName="rounded-lg p-2"
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <Flex
                    direction="column"
                    gap="2"
                >
                    {actionsList.map((action, index) => (
                        <Flex
                            key={index}
                            gap="2"
                            role="button"
                            onClick={action.onClick}
                            className="h-[20px] w-11"
                        >
                            <Text size="2">
                                {action.isPending ? (
                                    <Spinner size="2" />
                                ) : (
                                    action.title
                                )}
                            </Text>
                        </Flex>
                    ))}
                </Flex>
            </Popover>
        </Box>
    );
};
