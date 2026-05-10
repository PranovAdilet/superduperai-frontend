import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { slide, type SlideDirection } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import type { ReactNode } from "react";

type TransitionOptions = {
    width: number;
    height: number;
    durationInFrames: number;
    id: string;
    direction?: SlideDirection;
};

export const Transitions: Record<
    string,
    (options: TransitionOptions) => ReactNode
> = {
    none: ({ id }: TransitionOptions) => (
        <TransitionSeries.Transition
            key={id}
            presentation={fade()}
            timing={linearTiming({ durationInFrames: 1 })}
        />
    ),
    fade: ({ durationInFrames, id }: TransitionOptions) => (
        <TransitionSeries.Transition
            key={id}
            presentation={fade()}
            timing={linearTiming({ durationInFrames })}
        />
    ),
    slide: ({ durationInFrames, id, direction }: TransitionOptions) => (
        <TransitionSeries.Transition
            key={id}
            presentation={slide({ direction: direction })}
            timing={linearTiming({ durationInFrames })}
        />
    ),
    wipe: ({ durationInFrames, id, direction }: TransitionOptions) => (
        <TransitionSeries.Transition
            key={id}
            presentation={wipe({ direction: direction ?? undefined })}
            timing={linearTiming({ durationInFrames })}
        />
    ),
    flip: ({ durationInFrames, id }: TransitionOptions) => (
        <TransitionSeries.Transition
            key={id}
            presentation={flip()}
            timing={linearTiming({ durationInFrames })}
        />
    ),

    clockWipe: ({ width, height, durationInFrames, id }: TransitionOptions) => (
        <TransitionSeries.Transition
            key={id}
            presentation={clockWipe({ width, height })}
            timing={linearTiming({ durationInFrames })}
        />
    ),
};
