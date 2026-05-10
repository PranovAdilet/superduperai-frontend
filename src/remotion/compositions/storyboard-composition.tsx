import { VideoComponent } from "../components/video-component";

import type { FC } from "react";
import type { IProjectVideoConfig_Output, ISceneRead } from "@/shared/api";
import { Composition, getInputProps } from "remotion";
import { Theme } from "@radix-ui/themes";

import "@/shared/styles/index.scss";
import { calculateDurationsByScenes } from "../utils";

type Props = {
    scenes: ISceneRead[];
    width: number;
    height: number;
    fps: number;
    musicUrl?: string;
    config: IProjectVideoConfig_Output;
    projectType: string;
};

export const StoryboardComposition: FC = () => {
    const { scenes, musicUrl, config, projectType, ...props } =
        getInputProps<Props>();

    const durationInFrames = calculateDurationsByScenes({
        scenes,
        watermark: config.watermark ?? true,
    });

    return (
        <Composition
            id="Storyboard"
            {...props}
            durationInFrames={durationInFrames}
            component={() => (
                <Theme
                    accentColor="lime"
                    grayColor="mauve"
                    panelBackground="solid"
                    radius="large"
                    appearance="dark"
                >
                    <VideoComponent
                        scenes={scenes}
                        musicUrl={musicUrl}
                        showWatermark={config.watermark}
                        musicVolume={config.music_volume}
                        soundEffectVolume={config.sound_effect_volume}
                        voiceoverVolume={config.voiceover_volume}
                        transition={config.transition ?? undefined}
                        zoom={config.zoom ?? undefined}
                        showSubtitles={config.subtitles}
                        projectType={projectType}
                    />
                </Theme>
            )}
        />
    );
};
