"use client";

import type { FileTypeEnum, Transition, Zoom, ISceneRead } from "@/shared/api";

import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Fragment, memo, type FC } from "react";
import { AbsoluteFill, Easing, useVideoConfig } from "remotion";
import { Scene } from "./scene";
import { Transitions } from "./transitions";
import { FabricCanvas } from "@/shared/ui";
import { fade } from "@remotion/transitions/fade";

import { usePlayerSettingsStore } from "../store";
import {
    FPS,
    logoDurationScene,
    minSceneDurationInFrames,
    transitionDuration,
} from "../utils";
import { ScreenSaver, Watermark } from "./screensaver";

export type UpdatedScenesType = {
    url: string | null;
    durationInFrames: number;
    type: FileTypeEnum;
} & ISceneRead;

const calculatePlaybackRate = (scene: ISceneRead) => {
    if (
        !scene.file?.duration ||
        !scene.voiceover?.duration ||
        scene.file.duration > scene.voiceover.duration ||
        scene.file.video_generation?.generation_config_name ===
            "comfyui/lip-sync"
    )
        return 1;

    if (scene.file.duration >= 1) {
        return (scene.file.duration - 1) / scene.voiceover.duration;
    }
    return scene.file.duration / scene.voiceover.duration;
};

type Props = {
    scenes?: ISceneRead[];
    transition?: Transition;
    showWatermark?: boolean;
    zoom?: Zoom;
    showSubtitles?: boolean;
    projectType: string;
};

const ScenesComponent: FC<Props> = ({
    scenes,
    transition,
    zoom: projectZoom,
    showSubtitles: showProjectSubtitles,
    showWatermark: showProjectWatermark,
    projectType,
}) => {
    const { width, height } = useVideoConfig();

    const {
        transition: storeTransition,
        showSubtitles: showStoreSubtitles,
        showWatemark: showStoreWatermark,
        zoom,
    } = usePlayerSettingsStore();

    const { type, direction } = transition ?? storeTransition;

    const showWatermark = showProjectWatermark ?? showStoreWatermark;

    const showSubtitles = showProjectSubtitles ?? showStoreSubtitles ?? true;

    const logoDurationInFrames = logoDurationScene * FPS;

    return (
        <>
            <AbsoluteFill
                style={{ backgroundColor: "black", position: "relative" }}
            >
                <TransitionSeries>
                    {scenes?.map((scene, index) => {
                        const playbackRate = calculatePlaybackRate(scene);

                        const minDurationInFrames = scene.duration! * FPS;

                        const durationWithTransition =
                            minDurationInFrames > minSceneDurationInFrames
                                ? minDurationInFrames - transitionDuration
                                : minDurationInFrames;

                        const sceneDurationInFrames =
                            type === "none"
                                ? durationWithTransition
                                : type === "fade"
                                  ? minDurationInFrames
                                  : minDurationInFrames + 20;

                        return (
                            <Fragment key={index}>
                                <TransitionSeries.Sequence
                                    durationInFrames={sceneDurationInFrames}
                                    premountFor={120}
                                >
                                    <Scene
                                        type={scene.file?.type}
                                        url={scene.file?.url}
                                        playbackRate={playbackRate}
                                        zoom={projectZoom ?? zoom}
                                        durationInFrames={sceneDurationInFrames}
                                    />
                                </TransitionSeries.Sequence>

                                {minDurationInFrames >
                                    minSceneDurationInFrames &&
                                    Transitions[type]({
                                        width,
                                        height,
                                        durationInFrames:
                                            type === "fade" || type === "none"
                                                ? transitionDuration
                                                : 30,
                                        direction: direction ?? undefined,
                                        id: "1",
                                    })}
                            </Fragment>
                        );
                    })}
                    {showWatermark && (
                        <>
                            <TransitionSeries.Sequence
                                durationInFrames={logoDurationInFrames}
                            >
                                <ScreenSaver projectType={projectType} />
                            </TransitionSeries.Sequence>
                        </>
                    )}
                </TransitionSeries>

                <TransitionSeries>
                    {showSubtitles &&
                        scenes?.map((scene, index) => {
                            const sceneDurationInFrames = scene.duration! * FPS;
                            const durationWithTransition =
                                sceneDurationInFrames > minSceneDurationInFrames
                                    ? sceneDurationInFrames - transitionDuration
                                    : sceneDurationInFrames;

                            return (
                                <Fragment key={index}>
                                    <TransitionSeries.Sequence
                                        durationInFrames={
                                            durationWithTransition
                                        }
                                    >
                                        <FabricCanvas
                                            key={index}
                                            initialObjects={scene.objects}
                                            className="absolute left-0 top-0 size-full"
                                            width={width}
                                            height={height}
                                            readonly
                                        />
                                    </TransitionSeries.Sequence>
                                    <TransitionSeries.Sequence
                                        durationInFrames={transitionDuration}
                                    >
                                        {/* Чтобы эффект fade не накладывался на предыдущий текст */}
                                        <></>
                                    </TransitionSeries.Sequence>

                                    {sceneDurationInFrames >
                                        minSceneDurationInFrames && (
                                        <TransitionSeries.Transition
                                            timing={linearTiming({
                                                durationInFrames:
                                                    transitionDuration,
                                                easing: Easing.in(Easing.ease),
                                            })}
                                            presentation={fade()}
                                        />
                                    )}
                                </Fragment>
                            );
                        })}
                </TransitionSeries>
                {showWatermark && <Watermark projectType={projectType} />}
            </AbsoluteFill>
        </>
    );
};

export const Scenes = memo(ScenesComponent);
