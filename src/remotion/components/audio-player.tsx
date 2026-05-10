import { AbsoluteFill, Audio, useVideoConfig } from "remotion";
import type { FC } from "react";

type AudioPlayerProps = {
    src: string;
    startFrom?: number;
    duration: number;
    volume?: number;
};

export const AudioPlayer: FC<AudioPlayerProps> = ({
    src,
    startFrom = 0,
    duration = 0,
    volume = 1,
}) => {
    const { fps } = useVideoConfig();

    const startFrame = Math.floor(startFrom * fps);
    const endFrame = Math.floor(startFrom * fps + duration * fps);

    return (
        <AbsoluteFill>
            <Audio
                src={src}
                startFrom={startFrame}
                endAt={endFrame}
                volume={volume}
            />
        </AbsoluteFill>
    );
};
