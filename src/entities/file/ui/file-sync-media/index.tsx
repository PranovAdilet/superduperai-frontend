"use client";

import { Box, Flex, Spinner } from "@radix-ui/themes";
import clsx from "clsx";
import type { FC } from "react";
import { useRef, useEffect, useState } from "react";

type Props = {
    videoSrc?: string | null;
    voiceoverSrc?: string | null;
    musicSrc?: string | null;
    musicTrim?: { startDuration: number; endDuration: number };
    soundEffectSrc?: string | null;
    isPlaying: boolean;
    onEnded: () => void;
    videoVolume?: number;
    voiceoverVolume?: number;
    soundFXVolume?: number;
    musicVolume?: number;
    playbackRate?: number;
    duration: number;
    isReady?: boolean;
};

export const FileSyncMedia: FC<Props> = ({
    videoSrc,
    voiceoverSrc,
    soundEffectSrc,
    musicSrc,
    musicTrim,
    isPlaying,
    onEnded,
    soundFXVolume = 1,
    videoVolume = 1,
    voiceoverVolume = 1,
    musicVolume = 0.5,
    playbackRate = 1,
    duration,
    isReady,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const voiceoverRef = useRef<HTMLAudioElement>(null);
    const soundFXRef = useRef<HTMLAudioElement>(null);
    const musicRef = useRef<HTMLAudioElement>(null);
    const durationTimer = useRef<NodeJS.Timeout | null>(null);
    const currentTime = useRef(0);

    const [isVoiceoverEnded, setIsVoiceoverEnded] = useState(false);
    const [isSoundFXEnded, setIsSoundFXEnded] = useState(false);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const [isMusicEnded, setIsMusicEnded] = useState(false);

    useEffect(() => {
        if (!isReady) return;

        const playOrPause = (
            media: HTMLMediaElement | null,
            isEnded: boolean,
        ) => {
            if (!media) return;
            if (isPlaying && !isEnded) {
                void media.play();
            } else {
                media.pause();
            }
        };

        playOrPause(videoRef.current, isVideoEnded);
        playOrPause(voiceoverRef.current, isVoiceoverEnded);
        playOrPause(soundFXRef.current, isSoundFXEnded);
        playOrPause(musicRef.current, isMusicEnded);
    }, [
        isPlaying,
        isVideoEnded,
        isVoiceoverEnded,
        isSoundFXEnded,
        isMusicEnded,
        isReady,
        musicTrim,
    ]);

    useEffect(() => {
        const voiceover = voiceoverRef.current;
        const soundEffect = soundFXRef.current;
        const video = videoRef.current;
        const music = musicRef.current;

        const handleVoiceoverEnd = () => {
            setIsVoiceoverEnded(true);
        };
        const handleSoundFXEnd = () => {
            setIsSoundFXEnded(true);
        };
        const handleVideoEnd = () => {
            setIsVideoEnded(true);
        };
        const handleMusicEnd = () => {
            setIsMusicEnded(true);
        };

        voiceover?.addEventListener("ended", handleVoiceoverEnd);
        soundEffect?.addEventListener("ended", handleSoundFXEnd);
        video?.addEventListener("ended", handleVideoEnd);
        music?.addEventListener("ended", handleMusicEnd);

        return () => {
            voiceover?.removeEventListener("ended", handleVoiceoverEnd);
            soundEffect?.removeEventListener("ended", handleSoundFXEnd);
            video?.removeEventListener("ended", handleVideoEnd);
            music?.removeEventListener("ended", handleMusicEnd);
        };
    }, []);
    useEffect(() => {
        const video = videoRef.current;

        if (!playbackRate || !video) return;

        video.playbackRate = playbackRate;
    }, [playbackRate]);

    useEffect(() => {
        const video = videoRef.current;
        const voiceover = voiceoverRef.current;
        const soundEffect = soundFXRef.current;
        const music = musicRef.current;

        if (video) video.volume = videoVolume;
        if (voiceover) voiceover.volume = voiceoverVolume;
        if (soundEffect) soundEffect.volume = soundFXVolume;
        if (music) music.volume = musicVolume;
    }, [videoVolume, soundFXVolume, voiceoverVolume, musicVolume]);

    useEffect(() => {
        if (isPlaying) {
            durationTimer.current = setInterval(() => {
                currentTime.current += 0.1;

                if (currentTime.current >= duration) {
                    clearInterval(durationTimer.current!);
                    handleEnded();
                }
            }, 100);
        }

        return () => {
            if (durationTimer.current) {
                clearInterval(durationTimer.current);
            }
        };
    }, [isPlaying, duration, onEnded]);

    const handleEnded = () => {
        if (soundFXRef.current) {
            soundFXRef.current.currentTime = 0;
        }
        if (voiceoverRef.current) {
            voiceoverRef.current.currentTime = 0;
        }
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
        currentTime.current = 0;

        if (musicRef.current && musicTrim) {
            musicRef.current.currentTime = musicTrim.startDuration;
        }

        setIsVoiceoverEnded(false);
        setIsSoundFXEnded(false);
        setIsVideoEnded(false);
        setIsMusicEnded(false);

        onEnded();
    };

    return (
        <Flex
            justify="center"
            align="center"
            position="relative"
            direction="column"
            className="h-full overflow-hidden"
        >
            {!isReady && (
                <Box
                    position="absolute"
                    flexGrow="1"
                >
                    <Spinner />
                </Box>
            )}

            <Box
                height="100%"
                className={clsx("transition-opacity duration-300", {
                    "opacity-0": !isReady,
                    // "opacity-100 bg-black":
                    //     !isReady,
                })}
            >
                {videoSrc && (
                    <video
                        className="size-full max-h-full max-w-full"
                        src={videoSrc}
                        ref={videoRef}
                        controls={false}
                    >
                        <track kind="captions" />
                    </video>
                )}
            </Box>

            {voiceoverSrc && (
                <audio
                    ref={voiceoverRef}
                    src={voiceoverSrc}
                >
                    <track kind="captions" />
                </audio>
            )}
            {soundEffectSrc && (
                <audio
                    ref={soundFXRef}
                    src={soundEffectSrc}
                >
                    <track kind="captions" />
                </audio>
            )}
            {musicSrc && (
                <audio
                    ref={musicRef}
                    src={musicSrc}
                    onLoadedMetadata={() => {
                        if (musicRef.current && musicTrim) {
                            musicRef.current.volume = musicVolume;
                            musicRef.current.currentTime =
                                musicTrim.startDuration;
                        }
                    }}
                >
                    <track kind="captions" />
                </audio>
            )}
        </Flex>
    );
};
