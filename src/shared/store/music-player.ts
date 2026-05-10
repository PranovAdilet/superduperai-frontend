"use client";

import { create } from "zustand";

type MusicStore = {
    activePlayerId: string | null;
    setActivePlayerId: (id: string) => void;
};

export const useMusicPlayerStore = create<MusicStore>((set) => ({
    activePlayerId: null,
    setActivePlayerId: (id: string) => {
        set({ activePlayerId: id });
    },
}));
