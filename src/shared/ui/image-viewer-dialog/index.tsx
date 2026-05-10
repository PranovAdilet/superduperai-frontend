"use client";

import { usePreloadImages } from "@/shared/hooks";
import { useModal } from "@/shared/store";
import { Box, Flex, Spinner } from "@radix-ui/themes";
import {
    type PropsWithChildren,
    useMemo,
    useState,
    type FC,
    type ReactNode,
} from "react";

import ImageGallery from "react-image-gallery";

import "react-image-gallery/styles/css/image-gallery.css";
import "./style.scss";
import type { IFileRead } from "@/shared/api";

type Props = {
    children?: ReactNode;
};

export type ImageViewerTool = {
    name: string;
    Provider?: FC<PropsWithChildren>;
    Layer?: FC<{ active?: boolean }>;
    Control: FC<{ active: string; setActive: (value: string) => void }>;
};

type ModalProps = {
    image?: IFileRead;
    tools?: ImageViewerTool[];
};

const AnyImageGallery = ImageGallery as any;

export const ImageViewerDialog: FC<Props> = ({ children }) => {
    const { isOpen = true, type, close, data } = useModal<ModalProps>();

    const { image, tools } = data ?? {};

    const isModalOpen = isOpen && type == "imageViewerDialog";

    const imageAdapter = useMemo(
        () => image?.url ?? image?.thumbnail_url ?? "",
        [image],
    );

    const [activeTool, setActiveTool] = useState("");

    const imageSrc = useMemo(() => [imageAdapter], [imageAdapter]);

    const loaded = usePreloadImages(imageSrc, true);

    if (!isModalOpen || !image) return;

    const handleChildClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleClose = () => {
        if (activeTool === "inpainting") {
            return;
        }
        close();
    };

    const Content = (
        <Flex
            onClick={handleChildClick}
            position="relative"
            px="3"
        >
            <Box width="300px">{/* Пустая колонка для выравнивания */}</Box>
            <Flex
                flexGrow="1"
                position="relative"
            >
                <AnyImageGallery
                    items={[
                        {
                            original: image.url ?? "",
                            thumbnail: image.thumbnail_url ?? "z",
                        },
                    ]}
                    showThumbnails={false}
                    showPlayButton={false}
                    showBullets={false}
                    showNav={false}
                    showFullscreenButton={false}
                    onScreenChange={(isFullscreen: boolean) => {
                        if (!isFullscreen) {
                            close();
                        }
                    }}
                    startIndex={0}
                    additionalClass="gallery"
                />
                {tools?.map(
                    (tool, index) =>
                        tool.Layer && (
                            <tool.Layer
                                key={index}
                                active={activeTool === "inpainting"}
                            />
                        ),
                )}
            </Flex>
            <Flex
                width="300px"
                minWidth="300px"
                direction="column"
                gap="4"
                px="4"
                onClick={handleClose}
            >
                {tools?.map((tool, index) => (
                    <tool.Control
                        key={index}
                        active={activeTool}
                        setActive={setActiveTool}
                    />
                ))}
            </Flex>
        </Flex>
    );

    const ContentWithToolProviders =
        tools?.reduce(
            (acc, tool) =>
                tool.Provider ? <tool.Provider>{acc}</tool.Provider> : acc,
            Content,
        ) ?? Content;

    return (
        <>
            {children}
            <Flex
                onClick={handleClose}
                position="fixed"
                top="0"
                left="0"
                width="100vw"
                height="100vh"
                justify="center"
                align="center"
                className="z-50 bg-[rgba(0,0,0,0.8)]"
            >
                {!loaded ? (
                    <Box position="absolute">
                        <Spinner />
                    </Box>
                ) : (
                    ContentWithToolProviders
                )}
            </Flex>
        </>
    );
};
