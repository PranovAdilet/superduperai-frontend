"use client";

import type { ImageViewerTool } from "@/shared/ui";
import { type IFileRead } from "@/shared/api";
import { getControl } from "./control";
import { Layer } from "./layer";
import { Provider } from "./provider";

type Props = {
    file: IFileRead;
    projectId?: string;
    sceneId?: string;
    entityId?: string;
    onGenerating?: () => void;
    isActive?: boolean;
};

export const inpaintingTool = ({
    file,
    projectId,
    sceneId,
    entityId,
    onGenerating,
    isActive,
}: Props): ImageViewerTool => {
    const Control = getControl({
        file,
        projectId,
        entityId,
        sceneId,
        onGenerating,
        isActive,
    });

    return {
        name: "inpainting",
        Provider,
        Layer,
        Control,
    };
};
