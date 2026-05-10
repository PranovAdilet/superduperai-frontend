"use client";

import type { Zoom } from "@/shared/api";
import { FileTypeEnum } from "@/shared/api";
import { memo, type FC } from "react";
import {
    Img,
    OffthreadVideo,
    useCurrentFrame,
    interpolate,
    Easing,
} from "remotion";

type Props = {
    url?: string | null;
    type?: FileTypeEnum;
    playbackRate?: number;
    zoom: Zoom;
    durationInFrames: number;
};

const SceneComponent: FC<Props> = ({
    type,
    url,
    playbackRate,
    zoom,
    durationInFrames,
}) => {
    const frame = useCurrentFrame();

    const startScale = zoom.type === "out" ? 1.3 : 1;
    const endScale = zoom.type === "in" ? 1.3 : 1;

    const zoomScale =
        zoom.type === null
            ? 1
            : interpolate(
                  frame,
                  [0, durationInFrames],
                  [startScale, endScale],
                  {
                      easing: getEasingFunction(zoom.ease),
                      extrapolateRight: "clamp",
                  },
              );

    return type === FileTypeEnum.VIDEO ? (
        <OffthreadVideo
            src={url ?? ""}
            className="size-full"
            playbackRate={playbackRate}
            style={{ transform: `scale(${zoomScale})` }}
        />
    ) : (
        <Img
            src={url ?? ""}
            style={{ transform: `scale(${zoomScale})` }}
        />
    );
};

export const Scene = memo(SceneComponent);

const getEasingFunction = (easing?: Zoom["ease"]) => {
    switch (easing) {
        case "ease-in":
            return Easing.in(Easing.quad);
        case "ease-out":
            return Easing.out(Easing.quad);
        case "ease-in-out":
            return Easing.inOut(Easing.quad);
        default:
            return Easing.linear;
    }
};
