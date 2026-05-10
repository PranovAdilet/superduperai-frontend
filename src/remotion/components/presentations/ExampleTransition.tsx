import React, { useMemo, useState } from "react";
import { AbsoluteFill, random } from "remotion";
import type {
    TransitionPresentation,
    TransitionPresentationComponentProps,
} from "@remotion/transitions";

// Keep only Example related types and props
export type ExamplePresentationProps = {
    width: number;
    height: number;
    outerEnterStyle?: React.CSSProperties;
    outerExitStyle?: React.CSSProperties;
    innerEnterStyle?: React.CSSProperties;
    innerExitStyle?: React.CSSProperties;
};

// Keep only Example related component
const ExamplePresentation: React.FC<
    TransitionPresentationComponentProps<ExamplePresentationProps>
> = ({
    children,
    presentationDirection,
    presentationProgress,
    passedProps,
}) => {
    const [clipId] = useState(() => String(random(null)));

    const rotation = useMemo(() => {
        const rotationValue = 360 * presentationProgress; // Поворот на 360 градусов
        return `rotateY(${rotationValue}deg)`;
    }, [presentationProgress]);

    const style: React.CSSProperties = useMemo(
        () => ({
            width: "100%",
            height: "100%",
            ...(presentationDirection === "entering"
                ? passedProps.innerEnterStyle
                : passedProps.innerExitStyle),
            perspective: "1000px", // Создаем перспективу для 3D
        }),
        [
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
                <AbsoluteFill style={{ overflow: "visible" }}>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            transformStyle: "preserve-3d",
                            transform: rotation,
                            transition: "transform 1s",
                        }}
                    >
                        {/* Фронтальная грань */}
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "white",
                                backfaceVisibility: "hidden",
                                border: "1px solid black",
                            }}
                        >
                            {children}
                        </div>
                        {/* Правая грань */}
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "white",
                                backfaceVisibility: "hidden",
                                transform: "rotateY(90deg)",
                                border: "1px solid black",
                            }}
                        >
                            <svg
                                width="100%"
                                height="100%"
                                viewBox={`0 0 ${passedProps.width} ${passedProps.height}`}
                                style={{ overflow: "visible" }}
                            >
                                <defs>
                                    <clipPath id={clipId}>
                                        <rect
                                            x="0"
                                            y="0"
                                            width={passedProps.width}
                                            height={passedProps.height}
                                            fill="black"
                                        />
                                    </clipPath>
                                </defs>
                                <g>
                                    {/* Добавляем анимацию вращения */}
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 50% 50%"
                                        to="360 50% 50%"
                                        dur="2s"
                                        repeatCount="indefinite"
                                    />
                                </g>
                            </svg>
                        </div>
                        {/* Можно добавить другие грани по необходимости */}
                    </div>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};

// Keep only exampleTransition function
export const exampleTransition = (
    props: ExamplePresentationProps,
): TransitionPresentation<ExamplePresentationProps> => ({
    component: ExamplePresentation,
    props: props, // Removed unnecessary ?? {}
});
