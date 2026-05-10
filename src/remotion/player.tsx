"use client";

import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
    CallbackListener,
    PlayerRef,
    RenderPlayPauseButton,
} from "@remotion/player";
import { Player } from "@remotion/player";
import type { IMusicRead, ISceneRead } from "@/shared/api";
import { Flex, Spinner } from "@radix-ui/themes";
import { useUserMe } from "@/entities/user";
import { useAuthStore } from "@/shared/store";
import { calculateDurationsByScenes, FPS } from "./utils";
import { usePlayerSettingsStore } from "./store";
import { ProjectRatingPoster } from "@/features/project";
import { VideoComponent } from "./components/video-component";
import { AbsoluteFill } from "remotion";
import { Image } from "@/shared/ui";

type Props = {
    scenes?: ISceneRead[];
    aspectRatio?: number;
    music?: IMusicRead | null;

    isLoading?: boolean;
    projectRating?: number | null;
};

type Metadata = {
    durationInFrames: number;
    compositionWidth: number;
    compositionHeight: number;
    fps: number;
};

const VideoPlayer: FC<Props> = ({
    scenes,
    music,
    aspectRatio = 16 / 9,

    isLoading,
    projectRating,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<PlayerRef | null>(null);

    const [metadata, setMetadata] = useState<Metadata | null>(null);

    const { token } = useAuthStore((state) => state);

    const { data: user, isSuccess } = useUserMe({ enabled: !!token });

    const showWatemark = usePlayerSettingsStore((state) => state.showWatemark);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            let compositionWidth;
            let compositionHeight;

            if (containerWidth / aspectRatio <= containerHeight) {
                compositionWidth = containerWidth;
                compositionHeight = containerWidth / aspectRatio;
            } else {
                compositionHeight = containerHeight;
                compositionWidth = containerHeight * aspectRatio;
            }

            if (!compositionWidth || !compositionHeight) return;

            const totalDuration = calculateDuration();

            setMetadata({
                durationInFrames: totalDuration,
                fps: FPS,
                compositionWidth: Math.round(compositionWidth - 5),
                compositionHeight: Math.round(compositionHeight - 5),
            });
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [aspectRatio, scenes, user, isSuccess, showWatemark]);

    const calculateDuration = useCallback(() => {
        const watermark = user?.vip ? showWatemark : true;
        return calculateDurationsByScenes({ scenes, watermark });
    }, [user?.vip, scenes, showWatemark]);

    const inputProps = useMemo(() => {
        return {
            scenes,
            musicUrl: music?.file.url,
            projectType: process.env.NEXT_PUBLIC_PROJECT_TYPE ?? "superDuper",
        };
    }, [scenes, music?.file.url]);

    const renderPlayPauseButton: RenderPlayPauseButton = useCallback(() => {
        if (isLoading) {
            return (
                <Flex
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    title="Loading"
                >
                    <Spinner />
                </Flex>
            );
        }

        return null;
    }, [isLoading]);

    const renderPoster = useCallback(() => {
        if (isLoading && scenes?.[0].file?.thumbnail_url) {
            return (
                <AbsoluteFill>
                    <Image
                        width="100%"
                        height="100%"
                        src={scenes[0].file.thumbnail_url}
                    />
                </AbsoluteFill>
            );
        }

        return null;
    }, [isLoading, scenes]);

    return (
        <Flex className="grow p-3 pt-6">
            <Flex
                flexGrow="1"
                justify="center"
                align="center"
                ref={containerRef}
                position="relative"
            >
                {!projectRating && (
                    <RatingPoster
                        playerRef={playerRef}
                        metadata={metadata}
                    />
                )}

                {metadata && (
                    <Player
                        ref={playerRef}
                        {...metadata}
                        component={() => VideoComponent(inputProps)}
                        renderPlayPauseButton={renderPlayPauseButton}
                        renderPoster={renderPoster}
                        clickToPlay={!isLoading}
                        numberOfSharedAudioTags={10}
                        controls={true}
                        moveToBeginningWhenEnded={false}
                        showPosterWhenUnplayed
                    />
                )}
            </Flex>
        </Flex>
    );
};

export const RemotionPlayer = memo(VideoPlayer);

type PosterProps = {
    playerRef: React.RefObject<PlayerRef> | null;
    metadata: Metadata | null;
};
const Poster: FC<PosterProps> = ({ playerRef, metadata }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPoster, setShowPoster] = useState(false);

    const setPlayerRef = usePlayerSettingsStore((state) => state.setPlayerRef);

    useEffect(() => {
        if (!playerRef?.current) return;
        setPlayerRef(playerRef);
    }, [playerRef, setPlayerRef, metadata]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        const handleTimeUpdate: CallbackListener<"timeupdate"> = (e) => {
            if (!playerRef?.current) return;

            const currentFrame = e.detail.frame;
            const durationInFrames = metadata?.durationInFrames ?? 0;

            if (durationInFrames - currentFrame < 120) {
                timeoutId = setTimeout(() => {
                    if (!playerRef.current?.isPlaying()) {
                        setShowPoster(true);
                    }
                }, 300);
            } else {
                setShowPoster(false);
            }
        };

        const updateIsPlaying = () => {
            setIsPlaying(playerRef?.current?.isPlaying() ?? false);

            if (playerRef?.current?.isPlaying()) {
                if (timeoutId) clearTimeout(timeoutId);
                setShowPoster(false);
            }
        };

        playerRef?.current?.addEventListener("play", updateIsPlaying);
        playerRef?.current?.addEventListener("pause", updateIsPlaying);
        playerRef?.current?.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            playerRef?.current?.removeEventListener(
                "timeupdate",
                handleTimeUpdate,
            );
            playerRef?.current?.removeEventListener("play", updateIsPlaying);
            playerRef?.current?.removeEventListener("pause", updateIsPlaying);
        };
    }, [metadata]);

    const width = useMemo(() => {
        return playerRef?.current
            ?.getContainerNode()
            ?.clientWidth.toString()
            .concat("px");
    }, [showPoster, metadata]);

    return (
        <>{showPoster && !isPlaying && <ProjectRatingPoster width={width} />}</>
    );
};

const RatingPoster = memo(Poster);
