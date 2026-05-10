import { type FC } from "react";
import { AbsoluteFill } from "remotion";

import type { FileTypeEnum, Transition, Zoom, ISceneRead } from "@/shared/api";

import { Scenes } from "./scenes";
import { VolumesComponent } from "./volumes";

export type UpdatedScenesType = {
    url: string | null;
    durationInFrames: number;
    type: FileTypeEnum;
} & ISceneRead;

type Props = {
    scenes?: ISceneRead[];
    musicUrl?: string | null;
    showWatermark?: boolean;
    musicVolume?: number;
    soundEffectVolume?: number;
    voiceoverVolume?: number;
    transition?: Transition;
    zoom?: Zoom;
    showSubtitles?: boolean;
    projectType: string;
};

export const VideoComponent: FC<Props> = ({
    scenes,
    musicUrl,
    showWatermark,
    musicVolume,
    soundEffectVolume,
    voiceoverVolume,
    transition,
    zoom,
    showSubtitles,
    projectType,
}) => {
    return (
        <AbsoluteFill
            style={{ backgroundColor: "black", position: "relative" }}
        >
            <Scenes
                scenes={scenes}
                showWatermark={showWatermark}
                transition={transition}
                zoom={zoom}
                showSubtitles={showSubtitles}
                projectType={projectType}
            />

            <VolumesComponent
                musicUrl={musicUrl}
                scenes={scenes}
                musicVolume={musicVolume}
                soundEffectVolume={soundEffectVolume}
                voiceoverVolume={voiceoverVolume}
            />
        </AbsoluteFill>
    );
};
