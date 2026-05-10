import { getBoundingBox, translatePath } from "@remotion/paths";
import { makeStar } from "@remotion/shapes";
import React, { useMemo, useState } from "react";
import { AbsoluteFill, random } from "remotion";
import type {
    TransitionPresentation,
    TransitionPresentationComponentProps,
} from "@remotion/transitions";

export type StarPresentationProps = {
    width: number;
    height: number;
    outerEnterStyle?: React.CSSProperties;
    outerExitStyle?: React.CSSProperties;
    innerEnterStyle?: React.CSSProperties;
    innerExitStyle?: React.CSSProperties;
};

const StarPresentation: React.FC<
    TransitionPresentationComponentProps<StarPresentationProps>
> = ({
    children,
    presentationDirection,
    presentationProgress,
    passedProps,
}) => {
    const finishedRadius =
        Math.sqrt(passedProps.width ** 2 + passedProps.height ** 2) / 2;

    // Вычисляем внутренний и внешний радиус для звезды в зависимости от прогресса анимации
    const innerRadius = finishedRadius * presentationProgress;
    const outerRadius = finishedRadius * 2 * presentationProgress;

    // Создаём путь звезды
    const { path } = makeStar({
        innerRadius,
        outerRadius,
        points: 5,
    });

    const boundingBox = getBoundingBox(path);

    // Корректируем путь
    const translatedPath = translatePath(
        path,
        passedProps.width / 2 - boundingBox.width / 2,
        passedProps.height / 2 - boundingBox.height / 2,
    );

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
                    <svg>
                        <defs>
                            <clipPath id={clipId}>
                                <path
                                    d={translatedPath}
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

export const starTransition = (
    props: StarPresentationProps,
): TransitionPresentation<StarPresentationProps> => ({
    component: StarPresentation,
    props: props,
});
