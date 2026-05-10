import { Flex, ScrollArea } from "@radix-ui/themes";
import clsx from "clsx";
import type { ReactNode } from "react";

type ScrollingListType = {
    type?: "horizontal" | "vertical";
    children: ReactNode;
};

const ScrollingList = ({ children, type = "vertical" }: ScrollingListType) => {
    const isVertical = type === "vertical";
    const width = isVertical ? undefined : "0";
    const direction = isVertical ? "column" : undefined;

    return (
        <Flex
            flexGrow="1"
            flexBasis="0"
            width={width}
        >
            <ScrollArea scrollbars={type}>
                <Flex
                    direction={direction}
                    flexGrow="1"
                    height="100%"
                    gap="4"
                    className={clsx({
                        // ["pb-3"]: !isVertical,
                    })}
                >
                    {children}
                </Flex>
            </ScrollArea>
        </Flex>
    );
};

export { ScrollingList };
