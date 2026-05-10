"use client";

import type {
    DraggableProvidedDragHandleProps,
    DropResult,
} from "@hello-pangea/dnd";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Box, Flex } from "@radix-ui/themes";
import type { FC, PropsWithChildren, ReactNode } from "react";

type RootProps = {
    onDragEnd: (result: DropResult) => void;
    children: ReactNode;
};

const DraggingRoot: FC<RootProps> = ({ onDragEnd, children }) => {
    return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
};

const DraggingList: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Droppable droppableId="droppable-list">
            {(provided) => (
                <Flex
                    flexGrow="1"
                    direction="column"
                    gap="6"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    {children}
                    {provided.placeholder}
                </Flex>
            )}
        </Droppable>
    );
};

type CardProps = {
    idx: number;
    children: (
        dragHandleProps: DraggableProvidedDragHandleProps | null,
    ) => ReactNode;
};

const DraggingCard: FC<CardProps> = ({ idx, children }) => {
    return (
        <Draggable
            draggableId={`${idx}`}
            index={idx}
        >
            {(provided) => (
                <Box
                    flexGrow="1"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    {children(provided.dragHandleProps)}
                </Box>
            )}
        </Draggable>
    );
};

export const Dragging = {
    Root: DraggingRoot,
    List: DraggingList,
    Card: DraggingCard,
};
