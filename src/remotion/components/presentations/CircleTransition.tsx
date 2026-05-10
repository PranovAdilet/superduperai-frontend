import React, { useMemo, useState } from "react";
import { AbsoluteFill, random } from "remotion";
import type {
    TransitionPresentation,
    TransitionPresentationComponentProps,
} from "@remotion/transitions";

export type CirclePresentationProps = {
    width: number;
    height: number;
    outerEnterStyle?: React.CSSProperties;
    outerExitStyle?: React.CSSProperties;
    innerEnterStyle?: React.CSSProperties;
    innerExitStyle?: React.CSSProperties;
};

const CirclePresentation: React.FC<
    TransitionPresentationComponentProps<CirclePresentationProps>
> = ({
    children,
    presentationDirection,
    presentationProgress,
    passedProps,
}) => {
    const radius = Math.max(passedProps.width, passedProps.height) / 1.5;

    const currentRadius = radius * presentationProgress;

    const [clipId] = useState(() => String(random(null)));

    const style: React.CSSProperties = useMemo(
        () => ({
            width: "100%",
            height: "100%",
            clipPath:
                presentationDirection === "exiting"
                    ? undefined
                    : `url(#${clipId})`,
            ...(presentationDirection === "entering"
                ? passedProps.innerEnterStyle
                : passedProps.innerExitStyle),
        }),
        [
            clipId,
            passedProps.innerEnterStyle,
            passedProps.innerExitStyle,
            presentationDirection,
        ],
    );

    const outerStyle = useMemo(
        () => ({
            ...(presentationDirection === "entering"
                ? passedProps.outerEnterStyle
                : passedProps.outerExitStyle),
        }),
        [
            passedProps.outerEnterStyle,
            passedProps.outerExitStyle,
            presentationDirection,
        ],
    );

    return (
        <AbsoluteFill style={outerStyle}>
            <AbsoluteFill style={style}>{children}</AbsoluteFill>
            {presentationDirection === "exiting" ? null : (
                <AbsoluteFill>
                    <svg
                        width={passedProps.width}
                        height={passedProps.height}
                        viewBox={`0 0 ${passedProps.width} ${passedProps.height}`}
                    >
                        <defs>
                            <clipPath id={clipId}>
                                <circle
                                    cx={passedProps.width / 2}
                                    cy={passedProps.height / 2}
                                    r={currentRadius}
                                    fill="black"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};

export const circleTransition = (
    props: CirclePresentationProps,
): TransitionPresentation<CirclePresentationProps> => ({
    component: CirclePresentation,
    props: props,
});
