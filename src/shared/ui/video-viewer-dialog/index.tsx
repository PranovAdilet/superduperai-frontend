"use client";

import { useModal } from "@/shared/store";
import { Flex } from "@radix-ui/themes";
import { type FC, type ReactNode } from "react";
import { Video } from "../video";

type Props = {
    children?: ReactNode;
};

type ModalProps = {
    video: {
        url: string;
        thumbnail_url: string;
    };
};

export const VideoViewerDialog: FC<Props> = ({ children }) => {
    const { isOpen = true, type, close, data } = useModal<ModalProps>();

    const isModalOpen = isOpen && type == "videoViewerDialog";

    const { video } = data ?? {};

    const videoSrc = video?.url ?? video?.thumbnail_url ?? "";

    if (!isModalOpen || !videoSrc) return;

    const handleChildClick = (e: React.MouseEvent<HTMLVideoElement>) => {
        e.stopPropagation();
    };

    return (
        <>
            {children}
            <Flex
                onClick={close}
                position="fixed"
                top="0"
                left="0"
                width="100vw"
                height="100vh"
                justify="center"
                align="center"
                className="z-50 bg-[rgba(0,0,0,0.8)]"
            >
                <Flex
                    flexGrow="1"
                    height="80%"
                    position="relative"
                    justify="center"
                    align="center"
                    maxWidth="80%"
                >
                    <Video
                        width="100%"
                        height="100%"
                        onClick={handleChildClick}
                        src={videoSrc}
                        controls
                    />
                </Flex>
            </Flex>
        </>
    );
};
