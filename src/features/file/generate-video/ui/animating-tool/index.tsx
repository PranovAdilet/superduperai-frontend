"use client";

import type { ImageViewerTool } from "@/shared/ui";
import { getAnimatingControl } from "./control";
import type { IFileRead } from "@/shared/api";

type Props = {
    file: IFileRead;
    projectId: string;
    sceneId?: string;
    animatingPrompt?: string;
    isActive?: boolean;
    onGenerating?: () => void;
};

export const animatingTool = ({
    file,
    projectId,
    sceneId,
    animatingPrompt,
    onGenerating,
    isActive,
}: Props): ImageViewerTool => {
    const Control = getAnimatingControl({
        file,
        projectId,
        sceneId,
        animatingPrompt,
        isActive,
        onGenerating,
    });

    return {
        name: "animating",
        Control,
    };
};
