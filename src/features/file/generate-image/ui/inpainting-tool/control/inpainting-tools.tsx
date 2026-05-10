"use client";

import { useModal } from "@/shared/store";
import { Flex, Slider, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { Circle as FabricCircle } from "fabric";
import { PencilBrush, type Canvas, type TPointerEventInfo } from "fabric";
import { Circle, Palette, Trash2, X } from "lucide-react";
import { useEffect, useState, type FC } from "react";

type Props = {
    canvas?: Canvas | null;
    active?: boolean;
    onActiveChange: (value: string) => void;
    isCombined?: boolean;
};

export const cursorName = "cursor";

export const InpaintingTools: FC<Props> = ({
    canvas,
    onActiveChange,
    active,
    isCombined,
}) => {
    const [width, setWidth] = useState(100);

    const [cursor, setCursor] = useState<FabricCircle | null>(null);

    const maxBrushWidth = 200;

    const handleWidthChange = ([value]: [number]) => {
        const newWidth = value === 0 ? 1 : value;
        if (cursor) {
            cursor.set({
                radius: newWidth / 2,
            });
            canvas?.renderAll();
        }
        setWidth(newWidth);
    };

    useEffect(() => {
        if (!canvas) return;

        const circle = new FabricCircle({
            radius: width / 2,
            fill: "rgba(0, 0, 0, 0.3)",
            selectable: false,
            evented: false,
            visible: false,
        });

        circle.set("name", cursorName);

        canvas.add(circle);

        setCursor(circle);

        const updateCursorPosition = (options: TPointerEventInfo) => {
            const pointer = canvas.getScenePoint(options.e);
            circle.set({
                left: pointer.x - width / 2,
                top: pointer.y - width / 2,
                visible: active,
            });
            canvas.renderAll();
        };

        canvas.on("mouse:move", updateCursorPosition);

        return () => {
            canvas.off("mouse:move", updateCursorPosition);
            canvas.remove(circle);
        };
    }, [canvas, width, active]);

    useEffect(() => {
        if (!canvas) return;
        if (!canvas.freeDrawingBrush) return;
        canvas.freeDrawingBrush.width = width;
    }, [width, canvas]);

    const { close } = useModal();

    const handleDrawingModeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!canvas) return;

        if (active) {
            onActiveChange("");
            if (isCombined) {
                close();
            }
        } else {
            onActiveChange("inpainting");
        }
    };

    const handleDeleteObjects = () => {
        if (!canvas) return;
        canvas.clear();

        if (cursor) {
            canvas.add(cursor);
            canvas.renderAll();
        }
    };

    const switchToPencil = () => {
        if (!canvas) return;
        canvas.freeDrawingBrush ??= new PencilBrush(canvas);

        canvas.renderAll();
        canvas.freeDrawingBrush.width = width;
        canvas.freeDrawingBrush.color = "#a3e635";
    };

    useEffect(() => {
        if (!canvas) return;
        if (active) {
            canvas.isDrawingMode = true;
            switchToPencil();
        } else {
            canvas.isDrawingMode = false;
        }
    }, [active]);

    return (
        <Flex
            direction="column"
            gap="4"
            width="100%"
        >
            <Flex
                role="button"
                gap="3"
                align="center"
                className={clsx({
                    " hover:text-red-600": active,
                    " hover:text-lime-400": !active,
                })}
                onClick={handleDrawingModeChange}
            >
                {active ? (
                    <>
                        <X />
                        <Text>CLOSE</Text>
                    </>
                ) : (
                    <>
                        <Palette />
                        <Text>INPAINTING</Text>
                    </>
                )}
            </Flex>

            <Flex
                width="100%"
                align="center"
                gap="3"
                className={clsx(
                    active ? "opacity-100" : "opacity-0",
                    "transition-opacity duration-300",
                )}
            >
                <Circle size="15px" />
                <Slider
                    my="2"
                    value={[width]}
                    onValueChange={handleWidthChange}
                    max={maxBrushWidth}
                />
                <Circle size="30px" />
            </Flex>

            <Flex
                role="button"
                gap="3"
                align="center"
                onClick={handleDeleteObjects}
                className={clsx(
                    "opacity-0 transition-opacity duration-300 hover:text-lime-400",
                    [
                        {
                            "opacity-100": active,
                        },
                    ],
                )}
            >
                <Trash2 />
                <Text>Clear selection</Text>
            </Flex>
        </Flex>
    );
};
