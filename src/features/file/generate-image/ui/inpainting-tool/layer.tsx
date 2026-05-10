"use client";

import type { FC } from "react";
import { useEffect, useRef } from "react";
import { Canvas } from "fabric";
import { Flex } from "@radix-ui/themes";
import { useInpaintingToolContext } from "./provider";

export const Layer: FC<{ active?: boolean }> = ({ active }) => {
    const { setCanvas } = useInpaintingToolContext();

    const canvasRef = useRef<null | HTMLCanvasElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const width = containerRef.current?.clientWidth ?? 0;
        const height = containerRef.current?.clientHeight ?? 0;

        const fabricCanvas = new Canvas(canvasRef.current, {
            width,
            height,
        });
        setCanvas(fabricCanvas);
        const observeTarget = containerRef.current;

        if (!observeTarget) return;

        const resizeObserver = new ResizeObserver(() => {
            if (!containerRef.current) return;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            if (width !== 0 && height !== 0) {
                fabricCanvas.setDimensions({ width, height });
            }
        });

        resizeObserver.observe(observeTarget);

        return () => {
            resizeObserver.unobserve(observeTarget);
            resizeObserver.disconnect();

            void fabricCanvas.dispose();
            setCanvas(null);
        };
    }, [canvasRef]);

    return (
        <Flex
            position="absolute"
            width="100%"
            height="100%"
            style={{
                zIndex: active ? undefined : "-1",
            }}
        >
            <Flex
                width="100%"
                height="100%"
                ref={containerRef}
            >
                <canvas
                    ref={canvasRef}
                    className="size-full"
                    style={{ opacity: 0.5 }}
                />
            </Flex>
        </Flex>
    );
};
