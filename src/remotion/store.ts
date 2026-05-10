import type { PlayerRef } from "@remotion/player";
import type { SlideDirection } from "@remotion/transitions/slide";
import { RefObject } from "react";
import { create } from "zustand";

export type TransitionType =
    | "clockWipe"
    | "slide"
    | "flip"
    | "wipe"
    | "none"
    | "fade";

export type ZoomType = {
    type: "in" | "out" | null;
    ease: "linear" | "ease-in" | "ease-out" | "ease-in-out" | null;
};

type Store = {
    playerRef: React.RefObject<PlayerRef> | null;
    setPlayerRef: (playerRef: React.RefObject<PlayerRef> | null) => void;
    musicVolume: number;
    soundEffectVolume: number;
    voiceoverVolume: number;
    showWatemark: boolean;
    zoom: ZoomType;
    transition: {
        type: TransitionType;
        direction?: SlideDirection;
    };
    musicBeat: string;
    showSubtitles?: boolean;
    setState: (newState: Partial<Store>) => void;
};

export const usePlayerSettingsStore = create<Store>((set) => ({
    playerRef: null,
    musicVolume: 1,
    soundEffectVolume: 1,
    voiceoverVolume: 1,
    showWatemark: true,
    zoom: {
        type: null,
        ease: "ease-in-out",
    },
    musicBeat: "1",
    transition: {
        type: "none",
        direction: "from-right",
    },
    setState: (newState) => {
        set((state) => ({ ...state, ...newState }));
    },
    setPlayerRef: (playerRef: React.RefObject<PlayerRef> | null) => {
        set({ playerRef });
    },
}));
