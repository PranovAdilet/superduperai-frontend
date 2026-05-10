import React, { useState } from "react";
import { AbsoluteFill, random } from "remotion";
import type {
    TransitionPresentation,
    TransitionPresentationComponentProps,
} from "@remotion/transitions";

export type CubePresentationProps = {
    width: number;
    height: number;
    outerEnterStyle?: React.CSSProperties;
    outerExitStyle?: React.CSSProperties;
    innerEnterStyle?: React.CSSProperties;
    innerExitStyle?: React.CSSProperties;
};

const CubePresentation: React.FC<
    TransitionPresentationComponentProps<CubePresentationProps>
> = ({
    children,
    presentationDirection,
    presentationProgress,
    passedProps,
}) => {
    const [clipId] = useState(() => String(random(null)));

    const cubeSize = Math.min(passedProps.width, passedProps.height);

    const rotationProgress = presentationProgress;
    const rotationY = rotationProgress * 90;

    return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
            <AbsoluteFill
                style={{ ...passedProps.outerEnterStyle, overflow: "hidden" }}
            >
                <AbsoluteFill
                    style={{
                        width: "100%",
                        height: "100%",
                        clipPath:
                            presentationDirection === "exiting"
                                ? undefined
                                : `url(#${clipId})`,
                        ...(presentationDirection === "entering"
                            ? passedProps.innerEnterStyle
                            : passedProps.innerExitStyle),
                    }}
                >
                    {children}
                </AbsoluteFill>
                {presentationDirection === "exiting" ? null : (
                    <AbsoluteFill>
                        <svg
                            width={passedProps.width}
                            height={passedProps.height}
                            viewBox={`0 0 ${passedProps.width} ${passedProps.height}`}
                            style={{ overflow: "visible" }}
                        >
                            <defs>
                                <clipPath id={clipId}>
                                    {/* Передняя грань куба */}
                                    <rect
                                        x={passedProps.width / 2 - cubeSize / 2}
                                        y={
                                            passedProps.height / 2 -
                                            cubeSize / 2
                                        }
                                        width={cubeSize}
                                        height={cubeSize}
                                        fill="black"
                                    />
                                </clipPath>
                            </defs>
                            <g
                                transform={`translate(${
                                    passedProps.width / 2
                                }, ${passedProps.height / 2})`}
                            >
                                {/* Передняя грань */}
                                <rect
                                    x={-cubeSize / 2}
                                    y={-cubeSize / 2}
                                    width={cubeSize}
                                    height={cubeSize}
                                    fill="black"
                                    transform={`rotateY(${rotationY}deg)`}
                                />
                                {/* Правая грань */}
                                <rect
                                    x={-cubeSize / 2}
                                    y={-cubeSize / 2}
                                    width={cubeSize}
                                    height={cubeSize}
                                    fill="black"
                                    transform={`rotateY(${rotationY}deg) translate(${
                                        cubeSize / 2
                                    }px)`}
                                />
                            </g>
                        </svg>
                    </AbsoluteFill>
                )}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

export const cubeTransition = (
    props: CubePresentationProps,
): TransitionPresentation<CubePresentationProps> => ({
    component: CubePresentation,
    props: props,
});
