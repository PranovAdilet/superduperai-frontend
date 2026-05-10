"use client";

import type { Canvas } from "fabric";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

type InpaintingToolContextType = {
    canvas: Canvas | null;
    setCanvas: (canvas: Canvas | null) => void;
};

export const InpaintingToolContext = createContext<
    InpaintingToolContextType | undefined
>(undefined);

export const useInpaintingToolContext = () => {
    const context = useContext(InpaintingToolContext);
    if (!context) {
        throw new Error(
            "useInpaintingToolContext must be used within a Provider",
        );
    }
    return context;
};

export const Provider: React.FC = ({ children }: PropsWithChildren) => {
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    return (
        <InpaintingToolContext.Provider value={{ canvas, setCanvas }}>
            {children}
        </InpaintingToolContext.Provider>
    );
};
