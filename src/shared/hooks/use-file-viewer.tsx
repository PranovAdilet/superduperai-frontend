"use client";

import { useModal } from "../store";
import type { ImageViewerTool } from "../ui";
import type { IFileRead } from "../api";

export const useFileViewer = () => {
    const { open } = useModal();

    const zoomImage = (image: IFileRead, tools?: ImageViewerTool[]) => {
        open("imageViewerDialog", {
            image,
            tools,
        });
    };

    const zoomVideo = (video: IFileRead) => {
        open("videoViewerDialog", { video });
    };

    return { zoomImage, zoomVideo };
};
