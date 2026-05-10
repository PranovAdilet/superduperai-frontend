"use client";

import type { FC, PropsWithChildren } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Flex, Slider, Text } from "@radix-ui/themes";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "react-use";
import { timeFormat } from "@/shared/utils";
import { MusicThumbnail } from "@/shared/ui";
import { useMusicPlayerStore } from "@/shared/store";
import type { IMusicRead } from "@/shared/api";
import styles from "./styles.module.scss";

type Props = {
    music?: IMusicRead | null;
    dense?: boolean;
    onlyIcon?: boolean;
    selectedMusic?: IMusicRead;
} & { PlayPauseBtn?: FC<PropsWithChildren> };

export const MusicPlayer: FC<Props> = ({ music, dense, onlyIcon }) => {
    const [id] = useState<string>(Math.random().toString(16).slice(2));

    const [audio, state, controls] = useAudio({
        src: music?.file.url ?? "",
        autoPlay: false,
    });

    const { activePlayerId, setActivePlayerId } = useMusicPlayerStore();

    useEffect(() => {
        if (activePlayerId && activePlayerId !== id) {
            setIsPlaying(false);
            controls.pause();
        }
    }, [activePlayerId, controls, id]);

    const [currentTime, setCurrentTime] = useState(state.time);
    const [isPlaying, setIsPlaying] = useState(state.playing);

    useEffect(() => {
        if (state.time !== currentTime) {
            setCurrentTime(state.time);
        }
    }, [state.time, currentTime]);

    // useEffect(() => {
    //     // if (isPlaying) {
    //     //     controls.play();
    //     // } else {
    //     //     controls.pause();
    //     // }
    // }, [music, state.playing, isPlaying, controls]);

    useEffect(() => {
        if (!music) return;
        setActivePlayerId(id);
    }, [music]);

    // useEffect(() => {
    //     if (!state || dense) return;
    //     controls.play();
    //     setIsPlaying(true);
    // }, [activePlayerId, music]);

    // useEffect(() => {
    //     if (state.paused && state.playing) {
    //         controls.play();
    //         setIsPlaying(true);
    //     } else if (state.paused) {
    //         controls.pause();
    //         setIsPlaying(false);
    //     } else {
    //         controls.play();
    //         setIsPlaying(true);
    //     }
    // }, [music, state.duration]);

    const handlePlay = () => {
        try {
            if (isPlaying) {
                controls.pause();
            } else {
                setActivePlayerId(id);
                controls.play()!.catch((error: unknown) => {
                    console.error("Failed to play music:", error);
                });
            }
            setIsPlaying(!isPlaying);
        } catch (error: unknown) {
            console.error("Failed to play/pause music:", error);
        }
    };

    const handleProgressChange = ([value]: [number]) => {
        const newTime = (value / 100) * state.duration;
        setCurrentTime(newTime);
        controls.seek(newTime);
    };

    const handleVolumeChange = ([value]: [number]) => {
        const newVolume = value / 100;
        controls.volume(newVolume);
    };

    const progressValue = useMemo(
        () => [(currentTime / state.duration) * 100],
        [currentTime, state.duration],
    );

    const volumeValue = useMemo(() => [state.volume * 100], [state.volume]);

    const isMute = useMemo(
        () => state.muted || state.volume === 0,
        [state.volume, state.muted],
    );

    useEffect(() => {
        if (state.volume === 0) {
            controls.mute();
        } else {
            controls.unmute();
        }
    }, [state.volume, controls]);

    const handleMute = () => {
        if (state.muted) {
            controls.unmute();
        } else {
            controls.mute();
        }
    };

    if (onlyIcon) {
        return (
            <Button
                className="p-3"
                color="gray"
                variant="ghost"
                onClick={handlePlay}
                disabled={!music}
            >
                {isPlaying ? <Pause /> : <Play />}
                {audio}
            </Button>
        );
    }

    if (!music) {
        return (
            <Flex
                align="center"
                gap="5"
                width="100%"
            >
                <Box
                    width="80px"
                    height="80px"
                >
                    <MusicThumbnail />
                </Box>
                <Box>
                    <Text>No music selected</Text>
                    {audio}
                </Box>
            </Flex>
        );
    }

    return (
        <>
            <Flex
                align="center"
                gap="4"
                width="100%"
            >
                <Button
                    className="p-3"
                    color="gray"
                    variant="ghost"
                    onClick={handlePlay}
                >
                    {isPlaying ? <Pause /> : <Play />}
                </Button>
                <Box
                    width="80px"
                    height="80px"
                >
                    <MusicThumbnail thumbnail={music.thumbnail_url} />
                </Box>
                {!dense ? (
                    <Flex
                        direction="column"
                        flexGrow="1"
                    >
                        <Flex
                            gap="6"
                            align="center"
                        >
                            <Flex
                                direction="column"
                                gap="2"
                                flexGrow="1"
                            >
                                <Text weight="bold">{music.title}</Text>

                                <Slider
                                    className={styles.slider}
                                    value={progressValue}
                                    size="1"
                                    variant="soft"
                                    onValueChange={handleProgressChange}
                                />
                                <Flex
                                    justify="between"
                                    flexGrow="1"
                                >
                                    <Text
                                        size="1"
                                        color="gray"
                                    >
                                        {timeFormat(state.time)}
                                    </Text>
                                    <Text
                                        size="1"
                                        color="gray"
                                    >
                                        {state.duration > 0 &&
                                            timeFormat(state.duration)}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex
                                align="center"
                                width="80px"
                                gap="2"
                            >
                                <button onClick={handleMute}>
                                    {isMute ? <VolumeX /> : <Volume2 />}
                                </button>
                                <Slider
                                    className={styles.slider}
                                    value={volumeValue}
                                    size="1"
                                    variant="soft"
                                    onValueChange={handleVolumeChange}
                                />
                            </Flex>
                        </Flex>
                    </Flex>
                ) : (
                    <Flex
                        direction="column"
                        gap="1"
                        maxWidth="65px"
                    >
                        <Text
                            weight="bold"
                            className="truncate"
                        >
                            {music.title}
                        </Text>

                        <Text
                            className="line-clamp-2 opacity-80"
                            size="2"
                        >
                            {music.artist}
                        </Text>
                    </Flex>
                )}
            </Flex>
            {audio}
        </>
    );
};
