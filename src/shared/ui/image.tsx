"use client";

import type { ReactNode, CSSProperties } from "react";
import React, { useState, memo, useMemo } from "react";
import clsx from "clsx";
import { Box, Flex, Spinner } from "@radix-ui/themes";
import NextImage from "next/image";
import { ImageOff, Play } from "lucide-react";

type ImageProps = {
    src?: string | null;
    alt?: string;
    placeholder?: React.ReactNode;
    className?: string;
    imageClassName?: string;
    contain?: boolean;
    children?: ReactNode;
    width?: string;
    height?: string;
    style?: CSSProperties;
    isVideo?: boolean;
};

const ImageComponent = ({
    src,
    alt,
    width,
    height,
    placeholder,
    className,
    imageClassName,
    contain,
    style,
    children,
    isVideo,
}: ImageProps) => {
    const [isLoading, setIsLoading] = useState(src ? true : false);
    const [hasError, setHasError] = useState(src ? false : true);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const placeholderMemo = useMemo(() => {
        return placeholder ?? <ImageOff />;
    }, [placeholder]);

    return (
        <Flex
            align="center"
            justify="center"
            overflow="hidden"
            direction="column"
            position="relative"
            className={className}
            style={{
                width: width ?? "100%",
                height: height ?? "100%",
                ...style,
            }}
        >
            {hasError && <Box position="absolute">{placeholderMemo}</Box>}
            {isLoading && (
                <Box position="absolute">
                    <Spinner />
                </Box>
            )}
            {isVideo && !hasError && (
                <Box
                    position="absolute"
                    className="z-10"
                >
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
                width="100%"
                flexGrow="1"
                position="relative"
                className={clsx("transition-opacity duration-300", {
                    "opacity-0": isLoading,
                    "opacity-100": !isLoading && !hasError,
                })}
            >
                {src && (
                    <NextImage
                        src={src}
                        alt={alt ?? "image"}
                        fill
                        onLoad={handleLoad}
                        onError={handleError}
                        className={clsx(imageClassName, "bg-zinc-950")}
                        style={{
                            objectFit: contain ? "contain" : "cover",
                        }}
                    />
                )}
            </Box>
            {children}
        </Flex>
    );
};

export const Image = memo(ImageComponent);
