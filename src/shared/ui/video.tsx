"use client";

import type { ReactNode } from "react";
import React, { useState, memo, useMemo, useRef, useEffect } from "react";
import clsx from "clsx";
import { Box, Flex, Spinner } from "@radix-ui/themes";
import { Play, VideoOff } from "lucide-react";

type ImageProps = {
    src?: string | null;
    placeholder?: React.ReactNode;
    className?: string;
    // videoClassName?: string;
    children?: ReactNode;
    width?: string;
    height?: string;
    // style?: CSSProperties;
    showIcon?: boolean;

    isPlaying?: boolean;
    volume?: number;
    onIsPlaying?: (value: boolean) => void;
} & Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    "src" | "className" | "children"
>;

const VideoComponent = ({
    src,
    width,
    height,
    placeholder,
    className,
    children,
    showIcon: hasIcon,
    isPlaying,
    // onIsPlaying,
    volume,
    ...props
}: ImageProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isLoading, setIsLoading] = useState(!!src);
    const [hasError, setHasError] = useState(!src);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const placeholderMemo = useMemo(() => {
        return placeholder ?? <VideoOff />;
    }, [placeholder]);

    useEffect(() => {
        if (!videoRef.current || !volume) return;

        videoRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        if (isPlaying) {
            video.play().catch((error: unknown) => {
                console.error("Failed to play video:", error);
            });
        } else {
            video.pause();
        }
    }, [isPlaying, src]);

    return (
        <Flex
            justify="center"
            align="center"
            position="relative"
            direction="column"
            className={clsx("overflow-hidden", className)}
            height={height}
            width={width}
        >
            {hasError && <Box position="absolute">{placeholderMemo}</Box>}
            {isLoading && (
                <Box
                    position="absolute"
                    flexGrow="1"
                >
                    <Spinner />
                </Box>
            )}
            {hasIcon && !hasError && (
                <Box position="absolute">
                    <Play
                        opacity="0.8"
                        className="shadow-lg"
                        size="30px"
                        color="white"
                        fill="white"
                    />
                </Box>
            )}
            <Box
                height="100%"
                className={clsx("transition-opacity duration-300", {
                    "opacity-0": isLoading,
                    "opacity-100 bg-black": !isLoading && !hasError,
                })}
            >
                {src && (
                    <video
                        className="size-full max-h-full max-w-full"
                        src={src}
                        onLoadedData={handleLoad}
                        onError={handleError}
                        ref={videoRef}
                        controls={false}
                        {...props}
                    >
                        <track kind="captions" />
                    </video>
                )}
            </Box>
            {children}
        </Flex>
    );
};

export const Video = memo(VideoComponent);
