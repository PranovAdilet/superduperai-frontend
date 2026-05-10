"use client";

import { QualityTypeEnum } from "@/shared/api";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

export const useAspectRatio = () => {
    const [aspecRatio, setAspectRatio] = useState<string>("16:9");

    const [qualityType, setQualityType] = useState(QualityTypeEnum.HD);

    const [aspectRatioWidth, setAspectRatioWidth] = useState("");
    const [aspectRatioHeight, setAspectRatioHeight] = useState("");

    const handleAspectRatioHeightChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value;
        if (+value > 2500) {
            return;
        }
        setAspectRatioHeight(value);
    };

    const handleAspectRatioWidthChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value;
        if (+value > 2500) {
            return;
        }

        setAspectRatioWidth(value);
    };

    const handleRatioChange = (value: string) => {
        setAspectRatio(value);
    };

    const handleQualityChange = (value: QualityTypeEnum) => {
        setQualityType(value);
    };

    useEffect(() => {
        setAspectRatioWidth(aspectRatiosMap[qualityType][aspecRatio].width);
        setAspectRatioHeight(aspectRatiosMap[qualityType][aspecRatio].height);
    }, [aspecRatio, qualityType]);

    return {
        aspecRatio,
        setAspectRatio,
        qualityType,
        setQuality: setQualityType,
        aspectRatioWidth,
        aspectRatioHeight,
        setAspectRatioHeight,
        setAspectRatioWidth,

        handleAspectRatioHeightChange,
        handleAspectRatioWidthChange,
        handleRatioChange,
        handleQualityChange,

        aspectRatiosMap,
        qualityTypes,
    };
};

export const aspectRatiosMap: Record<
    string,
    Record<string, { width: string; height: string }>
> = {
    [QualityTypeEnum.FULL_HD]: {
        "16:9": {
            width: "1920",
            height: "1088",
        },
        "4:3": {
            width: "1664",
            height: "1216",
        },
        "1:1": {
            width: "1408",
            height: "1408",
        },
        "4:5": {
            width: "1408",
            height: "1760",
        },
        "9:16": {
            width: "1088",
            height: "1920",
        },
    },
    [QualityTypeEnum.HD]: {
        "16:9": {
            width: "1344",
            height: "768",
        },
        "4:3": {
            width: "1152",
            height: "896",
        },
        "1:1": {
            width: "1024",
            height: "1024",
        },
        "4:5": {
            width: "1024",
            height: "1280",
        },
        "9:16": {
            width: "768",
            height: "1344",
        },
    },
};

const qualityTypes = [
    {
        value: QualityTypeEnum.HD,
        label: "HD",
    },
    {
        label: "Full HD",
        value: QualityTypeEnum.FULL_HD,
    },
];
