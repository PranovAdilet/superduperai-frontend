"use client";

import type { FC, ReactNode } from "react";
import type { IFileRead, ISceneRead } from "@/shared/api";
import { useSceneUpdate } from "../..";

type Props = {
    children: (
        handleClick: (file: IFileRead | null) => void,
        isPending: boolean,
    ) => ReactNode;
    scene?: ISceneRead;
};

export const SceneSoundEffectSelectButton: FC<Props> = ({
    children,
    scene,
}) => {
    const { mutate: update, isPending } = useSceneUpdate();

    const handleClick = (file: IFileRead | null) => {
        if (!scene) return;
        if (!scene.file_id) return;
        update({
            id: scene.id,
            requestBody: {
                ...scene,
                file_id: scene.file_id,
                sound_effect_id: file?.id ?? null,
            },
        });
    };

    return <>{children(handleClick, isPending)}</>;
};
