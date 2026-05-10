"use client";

import type { ISceneRead } from "@/shared/api";
import { useActiveScroll } from "@/shared/hooks";
import { Dragging } from "@/shared/ui";
import type { DropResult } from "@hello-pangea/dnd";
import { Flex } from "@radix-ui/themes";
import { GripVertical } from "lucide-react";
import { useEffect, useState, type FC, type ReactNode } from "react";

type ItemProps = {
    children: ReactNode;
    index: number;
};

const Item: FC<ItemProps> = ({ children, index }) => {
    return (
        <Dragging.Card
            key={index}
            idx={index}
        >
            {(dragHandleProps) => (
                <Flex
                    flexGrow="1"
                    align="center"
                    gapX="3"
                    className="scroll-my-3"
                >
                    <Flex {...dragHandleProps}>
                        <GripVertical
                            size="30px"
                            color="gray"
                            className="cursor-grab"
                        />
                    </Flex>
                    {children}
                </Flex>
            )}
        </Dragging.Card>
    );
};

type RootProps = {
    scenes?: ISceneRead[];
    onDragChange: (scene: ISceneRead, order: number) => void;
    children: (
        storyboardScenes: ISceneRead,
        isActive: boolean,
        index: number,
    ) => ReactNode;
    dense: boolean;
};

const Root: FC<RootProps> = ({ children, scenes, onDragChange, dense }) => {
    const { activeRef, isActiveCard } = useActiveScroll(!!scenes);

    const [storyboard, setStoryboard] = useState(scenes);

    useEffect(() => {
        if (!scenes) return;
        setStoryboard(scenes);
    }, [scenes]);

    const handleDragEnd = (result: DropResult) => {
        const { destination, source } = result;
        if (
            !destination ||
            destination.index === source.index ||
            !storyboard?.length
        )
            return;

        const updatedStoryboard = [...storyboard];
        const [movedScene] = updatedStoryboard.splice(source.index, 1);
        const order = destination.index;
        updatedStoryboard.splice(order, 0, movedScene);

        onDragChange(movedScene, order);
        setStoryboard(updatedStoryboard);
    };

    return (
        <Dragging.Root onDragEnd={handleDragEnd}>
            <Dragging.List>
                {storyboard?.map((scene, index) => {
                    const isActive: boolean = dense && isActiveCard(scene.id);
                    return (
                        <Flex
                            key={scene.id}
                            ref={isActive ? activeRef : undefined}
                            flexGrow="1"
                        >
                            <ScenesList.Item index={index}>
                                {children(scene, isActive, index)}
                            </ScenesList.Item>
                        </Flex>
                    );
                })}
            </Dragging.List>
        </Dragging.Root>
    );
};

export const ScenesList = {
    Root,
    Item,
};
