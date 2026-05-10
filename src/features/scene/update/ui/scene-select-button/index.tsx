"use client";

import type { FC, ReactNode } from "react";
import type { IFileRead, ISceneRead } from "@/shared/api";
import { useSceneUpdate } from "../..";

type Props = {
    children: (
        handleClick: (file: IFileRead) => void,
        isPending: boolean,
    ) => ReactNode;
    scene?: ISceneRead;
};

export const SceneSelectButton: FC<Props> = ({ children, scene }) => {
    const { mutate: update, isPending } = useSceneUpdate();

    const handleClick = (file: IFileRead) => {
        if (!scene) return;
        update({
            id: scene.id,
            requestBody: {
                ...scene,
                file_id: file.id,
            },
        });
    };

    return <>{children(handleClick, isPending)}</>;
};
