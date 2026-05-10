"use client";

import { create } from "zustand";

type textStyles = Record<string, boolean>;

export type SceneTypes = {
    sceneId: string;
    value: string;

    fontSize: number;
    font: string;
    textAlign: string;

    aligment: string;

    effect?: string;
    color?: string;
    background?: string;

    textStyles: textStyles;
    // textStyles: {
    //     Bold: boolean;
    //     Italic: boolean;
    //     Underline: boolean;
    //     Uppercase: boolean;
    //     Strikethrought: boolean;
    // };

    transition?: {}; //если хотим использовать этот стор дальше
};

type StoreTypes = {
    scenes: SceneTypes[] | null;
    getSceneById: (scene: string) => SceneTypes | undefined;
    setScenes: (scenes: SceneTypes[]) => void;
    setScene: (scene: SceneTypes) => void;
};

export const useStoryboardScenesStore = create<StoreTypes>((set, get) => ({
    scenes: null,
    getSceneById: (sceneId) => {
        const { scenes } = get();
        return scenes?.find((scene) => scene.sceneId === sceneId);
    },
    setScenes: (scenes) => {
        set({ scenes });
    },
    setScene: (scene: SceneTypes) => {
        set((state) => {
            const { scenes } = state;

            if (scenes === null) {
                return { scenes: [scene] };
            }

            const sceneExists = scenes.some(
                (item) => item.sceneId === scene.sceneId,
            );

            if (sceneExists) {
                return {
                    scenes: scenes.map((item) =>
                        item.sceneId === scene.sceneId ? scene : item,
                    ),
                };
            }
            return {
                slides: [...scenes, scene],
            };
        });
    },
}));
