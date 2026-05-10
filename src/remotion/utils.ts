import type { ISceneRead } from '@/shared/api';

export const defaultDurationScene = 6;
export const defaultDurationVideoScene = 2.5;
export const logoDurationScene = 5;
export const FPS = 30;
export const transitionDuration = 10;
export const minSceneDurationInFrames = 30;

export const calculateDurationsByScenes = ({ scenes, watermark }: { scenes?: ISceneRead[]; watermark: boolean }) => {
    let totalDuration = 0;

    if (watermark) {
        totalDuration += logoDurationScene * FPS;
    }

    for (const scene of scenes ?? []) {
        const durationInFrames = scene.duration! * FPS;

        totalDuration += durationInFrames;

        if (scene.order !== 0) {
            totalDuration -= transitionDuration;
        }
    }

    return Math.ceil(totalDuration);
}