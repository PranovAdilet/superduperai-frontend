"use client";

import { Canvas, PencilBrush } from "fabric";
import { useEffect, useRef, useState } from "react";

type Props = {
    dependencies?: boolean;
};

export const useFabricDrawing = ({ dependencies }: Props) => {
    const [isDrawingMode, setIsDrawingMode] = useState(false);

    const [canvas, setCanvas] = useState<Canvas | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const width = containerRef.current?.clientWidth ?? 0;
        const height = containerRef.current?.clientHeight ?? 0;

        const fabricCanvas = new Canvas(canvasRef.current ?? undefined, {
            width,
            height,
        });

        fabricCanvas.isDrawingMode = true;

        const brush = new PencilBrush(fabricCanvas);
        brush.color = "red";
        brush.width = 4;
        fabricCanvas.freeDrawingBrush = brush;

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
        };
    }, [dependencies]);

    return {
        canvas,

        isDrawingMode,
        setIsDrawingMode,
        canvasRef,
        containerRef,
    };
};
