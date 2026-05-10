"use client";

import { type ISceneRead } from "@/shared/api";
import { memo, type FC } from "react";
import { Audio, Series, useVideoConfig } from "remotion";
import { AudioPlayer } from "./audio-player";
import { FPS, minSceneDurationInFrames, transitionDuration } from "../utils";
import { usePlayerSettingsStore } from "../store";

type Props = {
    scenes?: ISceneRead[];
    musicUrl?: string | null;
    musicVolume?: number;
    soundEffectVolume?: number;
    voiceoverVolume?: number;
};

const Volumes: FC<Props> = ({
    scenes,
    musicUrl,
    musicVolume: musicProjectVolume,
    soundEffectVolume: soundEffectProjectVolume,
    voiceoverVolume: voiceoverProjectVolume,
}) => {
    const {
        musicVolume: musicStoreVolume,
        soundEffectVolume: soundEffectStoreVolume,
        voiceoverVolume: voiceoverStoreVolume,
    } = usePlayerSettingsStore();

    const { durationInFrames } = useVideoConfig();

    const musicVolume = musicProjectVolume ?? musicStoreVolume;
    const soundEffectVolume =
        soundEffectProjectVolume ?? soundEffectStoreVolume;
    const voiceoverVolume = voiceoverProjectVolume ?? voiceoverStoreVolume;

    return (
        <>
            <Series>
                {scenes?.map((scene, index) => {
                    const sceneDurationInFrames = scene.duration! * FPS;

                    const durationWithTransition =
                        sceneDurationInFrames > minSceneDurationInFrames
                            ? sceneDurationInFrames - transitionDuration
                            : sceneDurationInFrames;

                    return (
                        <Series.Sequence
                            durationInFrames={durationWithTransition}
                            premountFor={10}
                            key={index}
                        >
                            {scene.sound_effect?.url && (
                                <Audio
                                    src={scene.sound_effect.url}
                                    volume={soundEffectVolume} //0.3
                                />
                            )}

                            {scene.voiceover?.url &&
                                scene.file?.video_generation
                                    ?.generation_config_name !==
                                    "comfyui/lip-sync" && (
                                    <Audio
                                        src={scene.voiceover.url}
                                        volume={voiceoverVolume} //1
                                    />
                                )}
                        </Series.Sequence>
                    );
                })}
            </Series>
            {musicUrl && (
                <AudioPlayer
                    src={musicUrl}
                    volume={musicVolume} //0.4
                    duration={durationInFrames}
                />
            )}
        </>
    );
};

export const VolumesComponent = memo(Volumes);
