"use client";

import type { FC, PropsWithChildren } from "react";
import React, { useEffect, useState } from "react";
import { Button, Flex, Spinner } from "@radix-ui/themes";
import { Download, Pause, Play } from "lucide-react";
import { useAudio } from "react-use";
import { useMusicPlayerStore } from "@/shared/store";

type Props = {
    src?: string | null;
    allowDownload?: boolean;
} & { PlayPauseBtn?: FC<PropsWithChildren> };

export const AudioPlayer: FC<Props> = ({ src, allowDownload }) => {
    const [id] = useState<string>(Math.random().toString(16).slice(2));
    const [audio, state, controls] = useAudio({
        src: src ?? "",
        autoPlay: false,
    });

    const { activePlayerId, setActivePlayerId } = useMusicPlayerStore();
    const [isPlaying, setIsPlaying] = useState(state.playing);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (activePlayerId && activePlayerId !== id) {
            setIsPlaying(false);
            controls.pause();
        }
    }, [activePlayerId, controls, id]);

    useEffect(() => {
        if (!isPlaying) return;
        setIsPlaying(false);
    }, [src]);

    useEffect(() => {
        if (state.duration && state.time === state.duration) {
            setIsPlaying(false);
        }
    }, [state.time, state.duration]);

    useEffect(() => {
        const loadAudio = async () => {
            try {
                if (!src) return;
                const response = await fetch(src);
                const arrayBuffer = await response.arrayBuffer();
                const audioContext = new AudioContext();
                await audioContext.decodeAudioData(arrayBuffer);
            } catch (error) {
                console.error("Failed to load audio:", error);
            }
        };
        void loadAudio();
    }, [src]);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isPlaying) {
            controls.pause();
        } else {
            setActivePlayerId(id);
            void controls.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleDownload = async () => {
        if (!src) return;
        try {
            setIsDownloading(true);
            const response = await fetch(src);
            if (!response.ok) throw new Error("Failed to download audio");

            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = src;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Error downloading audio:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Flex
            gap="3"
            align="center"
        >
            <Button
                className="p-3"
                color="gray"
                variant="ghost"
                onClick={handleToggle}
                disabled={!src}
            >
                {isPlaying ? <Pause /> : <Play />}
                {audio}
            </Button>
            {allowDownload && (
                <Button
                    className="p-3"
                    color="gray"
                    variant="ghost"
                    disabled={!src || isDownloading}
                    onClick={handleDownload}
                >
                    {isDownloading ? (
                        <Spinner className="w-[25px]" />
                    ) : (
                        <Download className="w-[25px]" />
                    )}
                </Button>
            )}
        </Flex>
    );
};
