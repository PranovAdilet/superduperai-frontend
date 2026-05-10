"use client";

import { useSceneList } from "@/entities/scene";
import { usePlayerSettingsStore } from "@/remotion/store";
import {
    defaultDurationScene,
    FPS,
    minSceneDurationInFrames,
    transitionDuration,
} from "@/remotion/utils";
import type { ISceneRead } from "@/shared/api";
import { Popover, RangeSlider } from "@/shared/ui";
import { Flex, Skeleton, Text } from "@radix-ui/themes";
import type { CallbackListener } from "@remotion/player";
import { memo, useEffect, useMemo, useState, type FC } from "react";

type Props = {
    projectId: string;
    onSceneUpdate?: (scene: ISceneRead, duration: number) => void;
    isPending?: boolean;
};

const MusicBeatsComponent: FC<Props> = ({
    projectId,
    onSceneUpdate,
    isPending,
}) => {
    const { data: scenes } = useSceneList({ projectId });

    const playerRef = usePlayerSettingsStore((state) => state.playerRef);
    const type = usePlayerSettingsStore((state) => state.transition.type);

    const [activeId, setActiveId] = useState<null | string>(null);

    const sceneMap = useMemo(() => {
        if (!scenes) return null;

        const map = new Map();
        let accumulatedFrame = 0;

        for (const scene of scenes.items) {
            const sceneDurationInFrames = scene.duration! * FPS;

            const durationWithTransition =
                sceneDurationInFrames > minSceneDurationInFrames
                    ? sceneDurationInFrames - transitionDuration
                    : sceneDurationInFrames;

            accumulatedFrame += durationWithTransition;
            map.set(accumulatedFrame, scene.id);
        }

        return map;
    }, [scenes, type]);

    useEffect(() => {
        if (!sceneMap) return;

        const handleTimeUpdate: CallbackListener<"timeupdate"> = (e) => {
            if (!playerRef?.current) return;

            const currentFrame = e.detail.frame;

            const closestTime = [...sceneMap.keys()].find(
                (key) => currentFrame <= key,
            );

            if (closestTime) {
                const id: string = sceneMap.get(closestTime);
                setActiveId(id);
            }
        };

        playerRef?.current?.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            playerRef?.current?.removeEventListener(
                "timeupdate",
                handleTimeUpdate,
            );
        };
    }, [playerRef, sceneMap]);

    const handleChangeDuration = (scene: ISceneRead, duration: number) => {
        onSceneUpdate?.(scene, duration);
    };

    return (
        <Flex
            width="100%"
            gap="2"
            justify="center"
        >
            {isPending &&
                [...Array(10)].map((_, index) => (
                    <Skeleton
                        width="35px"
                        height="35px"
                        key={index}
                    />
                ))}
            {!isPending &&
                scenes?.items.map((scene) => (
                    <Popover
                        key={scene.id}
                        trigger={
                            <Flex
                                justify="center"
                                align="center"
                                width="35px"
                                height="35px"
                                className={`rounded-lg text-black ${
                                    activeId === scene.id
                                        ? "bg-lime-300"
                                        : "bg-gray-100"
                                }`}
                                role="button"
                            >
                                <Text
                                    size="2"
                                    weight="medium"
                                >
                                    {scene.duration! % 1 === 0
                                        ? scene.duration
                                        : Math.round(scene.duration! * 100) /
                                          100}
                                </Text>
                            </Flex>
                        }
                    >
                        <Flex width="150px">
                            <RangeSlider
                                value={scene.duration ?? defaultDurationScene}
                                initialValue={scene.duration}
                                onDebouncedChange={(v) => {
                                    handleChangeDuration(
                                        scene as any as ISceneRead,
                                        v,
                                    );
                                }}
                                min={0.4}
                                max={30}
                                step={0.1}
                            />
                        </Flex>
                    </Popover>
                ))}
        </Flex>
    );
};

export const ProjectVideoMusicBeats = memo(MusicBeatsComponent);
