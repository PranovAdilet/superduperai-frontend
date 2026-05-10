"use client";

import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import { Trash2, MoreVertical } from "lucide-react";
import type { FC } from "react";
import { Popover } from "@/shared/ui";
import React, { useState } from "react";
import { useFileDelete } from "../../delete";

type ActionVariant = "danger" | "default";

type Props = {
    fileId: string;
};

export const FileActionsList: FC<Props> = ({ fileId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { mutate: deleteEntity, isPending: isDeleting } = useFileDelete();

    const handleDelete = () => {
        deleteEntity(
            { id: fileId },
            {
                onSuccess: () => {
                    setIsOpen(false);
                },
            },
        );
    };

    const actionsList: {
        title: string;
        onClick: () => void;
        isPending: boolean;
        icon: typeof Trash2;
        variant: ActionVariant;
    }[] = [
        {
            title: "Delete",
            onClick: handleDelete,
            isPending: isDeleting,
            icon: Trash2,
            variant: "danger",
        },
    ];

    const handleParentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <Box
            position="absolute"
            top="6px"
            left="6px"
            className="z-10 rounded-full bg-black/60 p-2 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-black/70"
            onClick={handleParentClick}
        >
            <Popover
                trigger={
                    <MoreVertical
                        size={16}
                        className="cursor-pointer text-white transition-colors duration-200 hover:text-red-400"
                    />
                }
                side="right"
                contentClassName="rounded-xl p-0 border border-slate-700/50 shadow-2xl overflow-hidden"
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <Box className="min-w-[140px] bg-gradient-to-br from-slate-900 to-slate-800">
                    <Flex
                        direction="column"
                        gap="0"
                    >
                        {actionsList.map((action, index) => {
                            const IconComponent = action.icon;
                            const isLastItem = index === actionsList.length - 1;

                            return (
                                <Flex
                                    key={index}
                                    gap="3"
                                    align="center"
                                    role="button"
                                    onClick={
                                        action.isPending
                                            ? undefined
                                            : action.onClick
                                    }
                                    className={`
                                        px-4 py-3 transition-all duration-200
                                        ${
                                            action.isPending
                                                ? "cursor-not-allowed opacity-75"
                                                : "cursor-pointer hover:scale-[0.98] active:scale-95"
                                        }
                                        ${
                                            action.variant === "danger"
                                                ? action.isPending
                                                    ? "text-red-400/60"
                                                    : "text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                                : action.isPending
                                                  ? "text-slate-400"
                                                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                        }
                                        ${!isLastItem ? "border-b border-slate-700/30" : ""}
                                    `}
                                >
                                    <Box className="shrink-0">
                                        {action.isPending ? (
                                            <Spinner
                                                size="2"
                                                className="text-current"
                                            />
                                        ) : (
                                            <IconComponent
                                                size={16}
                                                className="text-current"
                                            />
                                        )}
                                    </Box>
                                    <Text
                                        size="2"
                                        weight="medium"
                                        className="font-medium text-current"
                                    >
                                        {action.isPending
                                            ? "Deleting..."
                                            : action.title}
                                    </Text>
                                </Flex>
                            );
                        })}
                    </Flex>
                </Box>
            </Popover>
        </Box>
    );
};
